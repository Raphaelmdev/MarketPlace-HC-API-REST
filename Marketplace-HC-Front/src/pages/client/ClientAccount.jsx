import { useNavigate } from "react-router-dom";
import { MdReceiptLong, MdPerson, MdHome, MdInventory, MdShoppingBag } from "react-icons/md";
import { FaHeart } from "react-icons/fa";
import "@/styles/pages/ClientPages.css";

export function ClientAccount() {
  const navigate = useNavigate();

  return (
    <>

      <main className="client-page">
        <section className="client-hero">
          <div className="client-hero-inner">
            <h1>Sua Conta</h1>
            <p>Gerencie suas informações, pedidos e preferências.</p>
          </div>
        </section>

        <section className="account-container">
          <div className="account-cards">
            <button
              className="account-card"
              onClick={() => navigate("/client/profile")}
            >
              <div className="account-card-icon">
                <MdPerson />
              </div>

              <div>
                <h3>Seu perfil</h3>
                <p>Visualizar e atualizar seus dados pessoais.</p>
              </div>
            </button>

            <button
              className="account-card"
              onClick={() => navigate("/client/address")}
            >
              <div className="account-card-icon">
                <MdHome />
              </div>

              <div>
                <h3>Seu endereço</h3>
                <p>Consultar e atualizar seu endereço de entrega.</p>
              </div>
            </button>
              <button
                  className="account-card"
                  onClick={() => navigate("/cart")}
                >
                  <div className="account-card-icon">
                    <MdShoppingBag />
                  </div>

                  <div>
                    <h3>Seu carrinho</h3>
                    <p>Ver itens e finalizar sua compra.</p>
                  </div>
                </button>

            <button
              className="account-card"
              onClick={() => navigate("/client/orders")}
            >
              <div className="account-card-icon">
                <MdReceiptLong />
              </div>

              <div>
                <h3>Seus pedidos</h3>
                <p>Rastrear, consultar ou cancelar pedidos realizados.</p>
              </div>
            </button>

            <button
              className="account-card"
              onClick={() => navigate("/client/wishlist")}
            >
              <div className="account-card-icon">
                <FaHeart />
              </div>
              <div>
                <h3>Lista de desejos</h3>
                <p>Produtos salvos para comprar futuramente.</p>
              </div>
            </button>
            <button
            className="account-card "
            onClick={() => navigate("/products")}
          >
            <div className="account-card-icon">
              <MdInventory />
            </div>

            <div>
              <h3>Ver Coleção</h3>
              <p>Explorar a vitrine e encontrar novos itens.</p>
            </div>
          </button>
          </div>
        </section>
      </main>
    </>
  );
}