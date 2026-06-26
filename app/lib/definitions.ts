
export type event = {
    ID_Event:number;
    Date: Date;
    ID_Source: number;
    Slave_ID: number;
    Name: string;
    ID_Type: number;
    Value: number;
}

export type type = {
    ID_Source:number;
    ID_Type: number;
    Type_Name:string;
    Source_Name: string;
    Min_Value: number;
    Max_Value: number;
}


export type links= {
    name: string;
    id_source: number;
    url: string;
}

export type area = {
    Source_Name: string;
    Type_Name: string;
    Device_Name: string;
    Date: Date;
    Value: number;
    Min: number;
    Max: number;
}

export type Point = {
  time: string;
  ts: number;
  temp: number;
  device: string;
};

export type Props = {
  data: Point[];
  start: Date;
  end: Date;
  min:number;
  max:number;
};


export type DeviceId = string;

export type ListRoles = {
  ID: number
  Role: string;
}[]

export type CombinedPoint = {
  ts: number;  
  time: string;     
  [deviceId: string]: number | string;
};