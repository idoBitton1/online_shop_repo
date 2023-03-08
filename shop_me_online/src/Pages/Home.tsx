import React, { useEffect } from 'react';
//import './App.css';

//Apollo and graphql
import { useLazyQuery, useQuery, useMutation } from "@apollo/client"
import { GET_ALL_PRODUCTS, GET_TRANSACTION_ID, GET_USER } from "../Queries/Queries";
import { CREATE_TRANSACTION } from '../Queries/Mutations';

//redux
import { useDispatch } from 'react-redux';
import { actionsCreators } from "../state";
import { bindActionCreators } from 'redux';
import { useSelector } from 'react-redux';
import { ReduxState } from "../state";

//components
import { Header } from '../Components/Header/Header';
import { NavigationBar } from '../Components/Header/NavigationBar';
import { ProductsGrid } from '../Components/products/ProductsGrid';

export interface Product {
  id: string,
  name: string,
  price: number,
  quantity: number,
  category: string,
  img_location: string,
  img_uploaded: boolean
}

export interface Transaction { 
  id: string
  user_id: string,
  address: string,
  ordering_time: string,
  delivery_fee: number,
  paid: boolean
}

export interface TransactionSecondType { 
  id: string
  address: string,
  ordering_time: string,
  paid: boolean,
  delivery_fee: number,
  sum: number
}

export interface CartProduct { 
  item_id: string,
  transaction_id: string,
  product_id: string,
  amount: number,
  size: string
}

export interface Wishlist {
  user_id: string,
  product_id: string
}

function Home() {
  //redux states
  const user = useSelector((redux_state: ReduxState) => redux_state.user);
  const products = useSelector((redux_state: ReduxState) => redux_state.products);
  const transaction_id = useSelector((redux_state: ReduxState) => redux_state.transaction_id);
  
  //redux actions
  const dispatch = useDispatch();
  const { setFilterProducts, setProducts, setTransactionId } = bindActionCreators(actionsCreators, dispatch);

  //queries
  useQuery(GET_ALL_PRODUCTS, {
    fetchPolicy: "network-only",
    onCompleted(data) {
      setProducts(data.getAllProducts);
      setFilterProducts(data.getAllProducts);
    },
  });
  const [getTransactionId, { data: transaction_data }] = useLazyQuery(GET_TRANSACTION_ID);
  const [getAddress, { data: address_data }] = useLazyQuery(GET_USER);

  //mutations
  const [createTransaction] = useMutation(CREATE_TRANSACTION, {
    onCompleted(data) { 
      //if created a new one, set the new transaction id to the redux state
      setTransactionId(data.createTransaction.id);
    }
  });

  //wait for the user to connect
  useEffect(() => {
    if(user.token && !transaction_id) {
      //get the address of the user
      getAddress({
        variables: {
          userId: user.token.user_id
        }
      });
      
      //get the transaction of the user when he is connecting
      getTransactionId({
        variables: {
          user_id: user.token.user_id
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.token, transaction_id]);

  //when all the information that is needed is here, check if the user has an open transaction
  useEffect(() => {
    if(!user.token?.is_manager && transaction_data && address_data) {
      if(transaction_data.getTransactionId) { //if the user already has an open transaction, get it
        setTransactionId(transaction_data.getTransactionId);
      }
      else { //if not, create a new one
        //format today
        const formatted_now = formatDate();

        createTransaction({
          variables: {
            user_id: user.token?.user_id,
            address: address_data.getUser.address,
            paid: false,
            ordering_time: formatted_now
          }
        });

        window.location.reload(); //refresh
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transaction_data, address_data]);

  return (
    <div className="home_container">
      <Header />
      <NavigationBar
        products={products.products}
      />
      <ProductsGrid to_manage_product={false} />
    </div>
  );
}

export const formatDate = (): string => {
  const today: Date = new Date();
  const yyyy: number = today.getFullYear();
  let mm: number = today.getMonth() + 1; // Months start at 0
  let dd: number = today.getDate();

  let ddd: string = `${dd}`;
  let mmm: string = `${mm}`;
  if (dd < 10) ddd = '0' + dd;
  if (mm < 10) mmm = '0' + mm;

  const formatted_today: string = yyyy + '/' + mmm + '/' + ddd;
  return formatted_today;
}

export default Home;
