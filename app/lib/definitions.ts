
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

export type TypeRow = {
  ID_Type: number;
  Type_Name: string;
  Register: number;
  Register_Panel: number;
};

export type links= {
    name: string;
    id_source: number;
    url: string;
}

export type area = {
    Ip: string;
    Source_Name: string;
    Type_Name: string;
    Device_Name: string;
    Device_Real_Name: string;
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
  deviceName?: string;
};

export type Props = {
  data: Point[];
  start: Date;
  end: Date;
  min:number;
  max:number;
  type?: string;
  xDomain?: [number, number];
  fullRange?: [number, number];
  onFullRangeChange?: (d: [number, number]) => void;
  onXDomainChange?: (d: [number, number]) => void;
  hoveredTs?: number | null;
  hoveredX?: number;
  containerWidth?: number;
  isLoading?: boolean;
  onTooltipChange?: (info: {ts: number, x: number, w: number} | null) => void;
};


export type DeviceId = string;

export type ListRoles = {
  ID: number
  Role: string;
  Password: string;
}[]

export type CombinedPoint = {
  ts: number;  
  time: string;     
  [deviceId: string]: number | string;
};

export type Source = {
  Id_Source: number;
  Ip: string;
  Name: string;
  Is_Panel: Boolean;
};

export type NormyRow = {
  Id_Norm: number;
  Id_Source: number;
  Id_Type: number;
  Min_Value: number;
  Max_Value: number;
  Delta: number;
  Source_Name: string;
  Type_Name: string;
};

export type Device = {
  Id_Device: number
  Id_Source: number;
  Source: string;
  Slave_Id: number;
  Name: string;
  In_Out: string;
}

