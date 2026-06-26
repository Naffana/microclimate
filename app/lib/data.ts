import { log } from "node:console";
import { connect, sql } from "./db";
import { links, type, event, area, ListRoles} from "./definitions";

export async function fetchLinks() {
    const pool = await connect();

    try {
        const result = await pool
        .request()
        .query<links[]>(
           `select distinct source.name, source.id_source from source
           ` 
        )

    const links = result.recordset.map((link)=>(
        {
           ...link,
            url: `/source/${link.id_source}`
        }
    ))
    return links;
  } catch (error) {
    console.error("Ошибка базы данных:", error);
    throw new Error("Ошибка получения ссылок комнат");
  }
}

export async function fetchListRoles() {
    const pool = await connect();

    try {
        const result = await pool
        .request()
        .query<ListRoles>(
           `select distinct Auth.ID, Auth.Role from Auth` 
        )
    const Roles = result.recordset
    
    return Roles;
  } catch (error) {
    console.error("Ошибка базы данных:", error);
    throw new Error("Ошибка получения ролей");
  }
}

export async function fetchType(source:number) {
    const pool = await connect();

    try {
        const result = await pool
        .request()
        .input('source', sql.NVarChar, source)
        .query<type[]>(
           `select distinct
            Normy.ID_Type,
            Normy.ID_Source,
            Normy.Min_Value, 
            Normy.Max_Value, 
            Source.name as Source_Name,
            type.name as Type_Name
           from Normy
           join source on source.id_source = normy.id_source
           join type on type.ID_type = normy.ID_Type
           where normy.id_source = @source
           ` 
        )
    const type = result.recordset
    
    return type;
  } catch (error) {
    console.error("Ошибка базы данных:", error);
    throw new Error("Ошибка получения типов измерения");
  }
}

export async function fetchInfo(type:number, source: number, dateFrom?: string, dateTo?: string) {
    const pool = await connect();

     const now = new Date();
     const year = now.getUTCFullYear();
     const month = now.getUTCMonth();
     const day = now.getUTCDate();

    const start = dateFrom ? new Date(dateFrom) : new Date(Date.UTC(year, month, day, 0, 0, 0, 0));;
    const end = dateTo ? new Date(dateTo) : new Date(Date.UTC(year, month, day, 23, 59, 59, 999));
    end.setDate(end.getDate() + 1);
     try {
      
      
                const result = await pool
                .request()
                .input("type", sql.Int, type)
                .input("source", sql.Int, source)
                .input('start', sql.DateTime, start)
                .input('end', sql.DateTime, end)
                .query<event[]>(
                `select distinct device.Slave_ID, device.Name, event.Date, Event.Value
                    from Event
                    join Type on type.ID_type = Event.ID_Type
                    join device on device.ID_Device = event.ID_Device
                    where Type.ID_Type = @type and event.ID_Source = @source
                    AND event.Date >= @start
                    AND event.Date < @end
                    ORDER BY event.date DESC
                ` 
                )
            
            const info = result.recordset
            return info;
        } catch (error) {
            console.error("Ошибка базы данных:", error);
            throw new Error("Ошибка получения информации");
        }
}

export async function fetchArea(dateFrom?: string, dateTo?: string) {
 const pool = await connect();

    const now = new Date();
    const year = now.getUTCFullYear();
    const month = now.getUTCMonth();
    const day = now.getUTCDate();

    const start = dateFrom ? new Date(dateFrom) : new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
    const end = dateTo ? new Date(dateTo) : new Date(Date.UTC(year, month, day, 23, 59, 59, 999));
    end.setDate(end.getDate() + 1);
     try {
                const result = await pool
                .request()
                .input('start', sql.DateTime, start)
                .input('end', sql.DateTime, end)
                .query<area[]>(
                `select distinct 
                Type.Name as Type_Name, 
                Source.Name as Source_Name, 
                Event.Date, Event.Value, 
                Normy.Min_Value as Min,
                Normy.Max_Value as Max,
                Device.Slave_ID as Device_Name
                    from Event
                    join Type on type.ID_type = Event.ID_Type
                    join Source on Source.ID_source = Event.ID_Source
                    join device on Device.ID_Device = Event.ID_Device
                    join Normy on Normy.ID_Source = Event.ID_Source and Normy.ID_Type = Event.ID_type
                where event.Date >= @start
                    AND event.Date < @end
                ` 
                )
            const info = result.recordset
            return info;
        } catch (error) {
            console.error("Ошибка базы данных:", error);
            throw new Error("Ошибка получения информации");
        }
}

export type ChartPoint = {
  time: string;    
  value: number;
  device: string;
};

export type TypeChart = {
  type: string;    
  min: number;
  max: number;   
  data: ChartPoint[]; 
};

export type SourceCharts = {
  source: string;       
  charts: TypeChart[];
};



export async function fetchAreaInfo(dateFrom?: string, dateTo?: string): Promise<SourceCharts[]> {
  const rows = await fetchArea(dateFrom, dateTo);

  type Series = {
    min: number;
    max: number;
    data: ChartPoint[]; 
  };

  const bySource = new Map<string, Map<string, Series>>();

  for (const row of rows) {
    const source = row.Source_Name;
    const type = row.Type_Name;
    const min  = row.Min;
    const max = row.Max;

    if (!bySource.has(source)) {
      bySource.set(source, new Map());
    }
    const SourceMap = bySource.get(source)!;

    if (!SourceMap.has(type)) {
      SourceMap.set(type, {min, max, data: [],});
    }
    const list = SourceMap.get(type)!;

    list.data.push({
      time: row.Date.toISOString(),
      value: row.Value,
      device: row.Device_Name,
    });
  }

  const result: SourceCharts[] = [];

  for (const [source, typeMap] of bySource.entries()) {
    const charts: TypeChart[] = [];
    for (const [type, list] of typeMap.entries()) {
      charts.push({ type, data: list.data, min: list.min, max: list.max });
    }
    result.push({ source, charts });
  }

  
  return result;
}


