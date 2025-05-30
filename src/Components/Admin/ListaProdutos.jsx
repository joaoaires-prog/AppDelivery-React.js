import ProdutoCard from "./ProdutoCard"

export default function ListaProdutos({ produtos, onEdit, onDelete }) {
  if (produtos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Nenhum produto encontrado</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {produtos.map((produto) => (
        <ProdutoCard key={produto.id} produto={produto} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  )
}
