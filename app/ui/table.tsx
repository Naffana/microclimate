import clsx from "clsx";
import type { event } from "../lib/definitions";
type Props = {
  rows: event[];
  type: string;
  source: number;
  min: number;
  max: number;
};
function Table(
    { rows, type, min, max }: Props)
{
    return (
    <div className="flex flex-col h-full min-h-0 bg-border shadow-xl rounded-lg">
        <div className="flex flex-row justify-between mx-3 mt-2">
            <h1 className="bg-accent rounded-lg font-bold text-secondary px-2">{type}</h1>
            <p className="  text-text font-medium px-2" >Норма: {min} - {max}</p>
        </div>
        <div className="flex shrink-0">
            <table className="w-full text-center">
                <thead>
                    <tr>
                        <th className="w-1/4 border-b border-border px-2 py-2">Дата</th>
                        <th className="w-1/4 border-b border-border px-2 py-2">ID устройства</th>
                        <th className="w-1/4 border-b border-border px-2 py-2">Название</th>
                        <th className="w-1/4 border-b border-border px-2 py-2">Значение</th>
                    </tr>
                </thead>
            </table>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar mb-1 pb-5 rounded-2xl -mx-px">
            <table className="min-w-full text-center">
                <tbody className="divide-y-2 border-x-5 border-border bg-secondary divide-border">
                    {rows?.map((value, index) => {
                        return(
                    <tr
                        key={index}
                        className={clsx(
                        ' hover:bg-border transition-colors',
                        {
                            'bg-accent-red text-secondary hover:bg-red-400':
                            value.Value > max || value.Value < min
                        }
                        )}
                    >
                        <td className="w-1/4 px-6 py-1 text-sm">
                        {value.Date
                            ? new Date(value.Date).toLocaleString('ru-RU', {
                                day: '2-digit',
                                month: '2-digit',
                                year: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                                timeZone: 'UTC'
                            })
                            : '-'}
                        </td>
                        <td className="w-1/4 px-6 py-1 text-sm">
                        {value.Slave_ID}
                        </td>
                        <td className="w-1/4 px-6 py-1 text-sm">
                        {value.Name}
                        </td>
                        <td className="w-1/4 px-6 py-1 text-sm font-medium">
                        {value.Value?.toFixed(2) ?? '-'}
                        </td>
                    </tr>
                    )})}
                </tbody>
            </table>
        </div>
    </div>
    );
}

export default Table;