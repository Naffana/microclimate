import { fetchType } from "../../lib/data";
import Filtr_data from "../filtr-data";
import { TableClient } from "./info_refresh";
import ExportExcelButton from "./ExportExcelButton";

type Props = {
  source: number;
  searchParams?: {
    dateFrom?: string;
    dateTo?: string;
  };
};

async function Page_info({ source, searchParams }: Props) {
  const type_info = await fetchType(source);

  const dateFrom = searchParams?.dateFrom;
  const dateTo = searchParams?.dateTo;

  const sourceName =
    type_info[0]?.Source_Name ?? "Комната";

  return (
    <div className="h-screen flex flex-col items-center justify-center-safe mt-2">
      <h1 className="text-center rounded-lg w-fit text-text font-bold my-3 px-2 text-2xl flex shrink-0">
        {sourceName}
      </h1>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Filtr_data />

        <ExportExcelButton
          sourceName={sourceName}
          dateFrom={dateFrom}
          dateTo={dateTo}
          types={type_info}
        />
      </div>

      <div className="flex flex-wrap flex-row w-full min-h-0">
        {type_info.map((value) => (
          <div
            className="w-[48%] m-2 h-9/10 min-h-0 rounded-lg pb-5 flex flex-col"
            key={`${value.ID_Source}-${value.ID_Type}`}
          >
            <TableClient
              id_type={value.ID_Type}
              type={value.Type_Name}
              source={value.ID_Source}
              min={value.Min_Value}
              max={value.Max_Value}
              dateFrom={dateFrom}
              dateTo={dateTo}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Page_info;