const TicketForm = ({
    form, setForm,
    clientes, busquedaCliente, setBusquedaCliente, buscarCliente, resetCliente, seleccionarCliente,
    tecnicos, busquedaTecnico, setBusquedaTecnico, buscarTecnico, resetTecnico, seleccionarTecnico
}) => {

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Código del Ticket</label>
                    <input name="codigo" value={form.codigo} onChange={(e) => setForm({...form, codigo: e.target.value})} placeholder="Ej: TKT-100" className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#FF6F61]" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción (mín. 10 carac.)</label>
                    <input name="descripcion" value={form.descripcion} onChange={(e) => setForm({...form, descripcion: e.target.value})} placeholder="Detalle el problema" className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#FF6F61]" required />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                {/* BUSCADOR CLIENTES */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <h3 className="text-[#FF6F61] font-bold mb-3 text-xs uppercase">1. Buscar Cliente (Cédula)</h3>
                    <div className="flex gap-2 mb-3">
                        <input type="text" value={busquedaCliente} onChange={(e) => setBusquedaCliente(e.target.value)} placeholder="Ingrese Cédula..." className="flex-1 p-2 rounded-lg border border-gray-300 text-sm" />
                        <button type="button" onClick={buscarCliente} className="bg-[#FF6F61] text-white px-3 py-2 rounded-lg text-sm hover:bg-orange-600">Buscar</button>
                        <button type="button" onClick={resetCliente} className="bg-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm">✕</button>
                    </div>
                    <div className="max-h-32 overflow-y-auto bg-white rounded-lg border border-gray-200">
                        {clientes.length > 0 ? clientes.map(c => (
                            <div key={c._id} onClick={() => seleccionarCliente(c)} className={`p-2 cursor-pointer border-b last:border-0 hover:bg-orange-50 ${form.cliente === c._id ? 'bg-orange-100 border-l-4 border-[#FF6F61]' : ''}`}>
                                <p className="text-xs font-bold">{c.nombre} {c.apellido}</p>
                                <p className="text-[10px] text-gray-500">{c.cedula}</p>
                            </div>
                        )) : <p className="p-2 text-xs text-center text-gray-400">No hay resultados</p>}
                    </div>
                </div>

                {/* BUSCADOR TÉCNICOS */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <h3 className="text-[#FF6F61] font-bold mb-3 text-xs uppercase">2. Buscar Técnico (Cédula)</h3>
                    <div className="flex gap-2 mb-3">
                        <input type="text" value={busquedaTecnico} onChange={(e) => setBusquedaTecnico(e.target.value)} placeholder="Ingrese Cédula..." className="flex-1 p-2 rounded-lg border border-gray-300 text-sm" />
                        <button type="button" onClick={buscarTecnico} className="bg-[#FF6F61] text-white px-3 py-2 rounded-lg text-sm hover:bg-orange-600">Buscar</button>
                        <button type="button" onClick={resetTecnico} className="bg-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm">✕</button>
                    </div>
                    <div className="max-h-32 overflow-y-auto bg-white rounded-lg border border-gray-200">
                        {tecnicos.length > 0 ? tecnicos.map(t => (
                            <div key={t._id} onClick={() => seleccionarTecnico(t)} className={`p-2 cursor-pointer border-b last:border-0 hover:bg-orange-50 ${form.tecnico === t._id ? 'bg-orange-100 border-l-4 border-[#FF6F61]' : ''}`}>
                                <p className="text-xs font-bold">{t.nombre} {t.apellido}</p>
                                <p className="text-[10px] text-gray-500">{t.cedula}</p>
                            </div>
                        )) : <p className="p-2 text-xs text-center text-gray-400">No hay resultados</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketForm;