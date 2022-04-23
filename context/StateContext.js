import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast"

const Context = createContext();

export const StateContext = ({ children }) => {
    const [showCart, setShowCart] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0)
    const [totalQuantities, setTotalQuantities] = useState(0)
    const [qty, setQty] = useState(1)

    let foundProduct;
    let index;

    const incrementQuantity = () => {
        setQty((prev) => prev + 1);
    }

    const decrementQuantity = () => {
        if (qty > 1) {
            setQty((prev) => prev - 1);
        }
    }

    const onAdd = (product, quantity) => {
        const checkProductInCart = cartItems.find(item => item._id === product._id);
        setTotalPrice(prev => prev + product.price * quantity);
        setTotalQuantities(prev => prev + quantity);

        if (checkProductInCart) {
            const updatedCartItems = cartItems.map(cartProductItem => {
                if (cartProductItem._id === product._id) return {
                    ...cartProductItem,
                    quantity: cartProductItem.quantity + quantity
                }
            })
            setCartItems(updatedCartItems)
        } else {
            product.quantity = quantity;
            setCartItems([...cartItems, { ...product }])
        }

        toast.success(`${qty} ${product.name} added to the cart.`)
    }

    const toggleCartItemQuantity = (id, value) => {
        foundProduct = cartItems.find(item => item._id === id);
        index = cartItems.findIndex(product => product._id === id);
        const newCartItems = cartItems.filter(item => item._id !== id)

        if (value === "inc") {
            cartItems.splice(index, 1)
            setCartItems([{ ...foundProduct, quantity: foundProduct.quantity + 1 }, ...newCartItems])
            setTotalPrice(prev => prev + foundProduct.price)
            setTotalQuantities(prev => prev + 1)
        } else if (value === 'dec') {
            if (foundProduct.quantity > 0) {
                cartItems.splice(index, 1)
                setCartItems([...newCartItems, { ...foundProduct, quantity: foundProduct.quantity - 1 }])
                setTotalPrice(prev => prev - foundProduct.price)
                setTotalQuantities(prev => prev - 1)
            }
        }
    }

    const onRemove = (product) => {
        foundProduct = cartItems.find(item => item._id === product._id);
        const newCartItems = cartItems.filter(item => item._id !== product._id)

        setTotalPrice(prev => prev - foundProduct.price * foundProduct.quantity)
        setTotalQuantities(prev => prev - foundProduct.quantity)
        setCartItems(newCartItems)
    }

    return (
        <Context.Provider value={{
            showCart,
            cartItems,
            totalPrice,
            totalQuantities,
            qty,
            decrementQuantity,
            incrementQuantity,
            setQty,
            onAdd,
            setShowCart,
            toggleCartItemQuantity,
            onRemove,
            setCartItems,
            setTotalPrice,
            setTotalQuantities
        }}>
            {children}
        </Context.Provider>
    )
}

export const useStateContext = () => useContext(Context);