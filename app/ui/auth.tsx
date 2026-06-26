'use client'
import { useState } from "react";
import { ListRoles } from "../lib/definitions";
import { useRouter } from "next/navigation";
import { login } from "../lib/auth-actions";

function Auth( {roles}:{roles:ListRoles}) {
    
    const [selected, setSelected] = useState<string | undefined>();
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const Role = e.target.value;
        setSelected(Role);
    };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!selected || !password) {
      setError("Выберите роль и введите пароль");
      setLoading(false);
      return;
    }

    const res = await login(selected, password);

    setLoading(false);

    if (!res.success) {
      setError("Неверный пароль");
      return;
    }

    window.location.href = "/source/home";
  };
    return (
        <form className="w-full h-full flex items-center" onSubmit={handleSubmit}>
            <div className="bg-gray-300 w-100 h-auto flex flex-col text-center mx-auto rounded-xl shadow-lg px-10 py-7">
                <h1 className="text-secondary font-medium text-4xl mb-5">Авторизация</h1>
                <div className="flex flex-col w-full">
                    <label htmlFor="Role" className="font-medium text-xl text-text m-1">Логин</label>
                    <select className="rounded-lg text-lg border-0 py-3 focus:border focus:border-accent" name="Role" value={selected ?? ""} id="Role" required onChange={handleChange}>
                        <option className="italic" value="">Выберите роль</option>
                        {roles.map((values)=>(
                            <option key={values.ID} value={values.Role}>{values.Role}</option>
                        ))}
                    </select>
                    <label htmlFor="pas" className="font-medium text-lg text-text m-1 mt-3" >Пароль</label>
                    <input className="text-lg py-3 rounded-lg border-0 focus:border focus:border-accent"
                     type="password" placeholder="Введите пароль" name="pas" id="pas" required  value={password}
                     onChange={(e) => setPassword(e.target.value)} />
                </div>
                 {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
                <div>
                    <button className="bg-accent text-2xl cursor-pointer rounded-lg text-secondary font-medium hover:border-2 hover:border-secondary w-35 h-15 mt-7"
                     type="submit"  disabled={loading}>
                    {loading ? "Входим..." : "Войти"}
                    </button>
                </div>
            </div>
        </form>
    );
}

export default Auth;