import { useCart } from "../hooks/useCart";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { handleImageError } from "../utils/imageFallback";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const { t } = useTranslation();

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t('cart.title')}</h1>
        {cartItems.length > 0 && (
          <button
            onClick={clearCart}
            className="text-red-500 hover:text-red-700 text-sm"
          >
            {t('cart.clear_cart')}
          </button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">{t('cart.empty')}</p>
          <Link to="/" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
            {t('common.continue_shopping')}
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between items-center p-4 border rounded-lg shadow">
              <div className="flex items-center space-x-4">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-16 h-16 object-cover rounded"
                  onError={(e) => handleImageError(e, 'small')}
                />
                <div>
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center border rounded-full hover:bg-gray-100"
                    aria-label={`Decrease quantity of ${item.name}`}
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center border rounded-full hover:bg-gray-100"
                    aria-label={`Increase quantity of ${item.name}`}
                  >
                    +
                  </button>
                </div>
                <span className="font-semibold text-blue-600">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700"
                  aria-label={`Remove ${item.name} from cart`}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}

          <div className="text-right mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="text-xl font-bold">
              {t('common.total')}: <span className="text-green-600">${cartTotal.toFixed(2)}</span>
            </div>
            <Link
              to="/checkout"
              className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              {t('cart.proceed_to_checkout')}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart; 