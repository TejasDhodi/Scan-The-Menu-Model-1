import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import OrderTable from '../../components/Admin/OrderTable';
import '../../Styles/Admin/AdminPages.css'
import { IoMdDoneAll } from "react-icons/io";
import { MdRemoveDone } from "react-icons/md";

const Orders = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [showTable, setShowTable] = useState(false);

  const [pageLimit, setPageLimit] = useState(5);
  const [pendingPageCount, setPendingPageCount] = useState(1);
  const [deliveredPageCount, setDeliveredPageCount] = useState(1);
  const pendingCurrentPage = useRef()
  const deliveredCurrentPage = useRef()

  const handlePageClick = (e) => {
    try {
      console.log(e.selected + 1);
      pendingCurrentPage.current = e.selected + 1
      deliveredCurrentPage.current = e.selected + 1

      handleGetPendingOrders();
      handleGetDeliveredOrders();
      
    } catch (error) {
      console.log('handlePageClick : ', error);
    }
  }

  const handleGetPendingOrders = async () => {
    try {
      const response = await axios.get(`https://scan-the-menu.onrender.com/api/v1/orders/pending?page=${pendingCurrentPage.current}&limit=${pageLimit}`);
      const data = response.data;
      setPendingPageCount(data?.result.pageCount);
      setPendingOrders(data?.result.paginatedResult);
      console.log('pend pag res', data);
    } catch (error) {
      console.log('Unable to get Pending orders : ', error);
    }
  };

  const handleGetDeliveredOrders = async () => {
    try {
      const response = await axios.get(`https://scan-the-menu.onrender.com/api/v1/orders/delivered?page=${deliveredCurrentPage.current}&limit=${pageLimit}`);
      const data = response.data;
      setDeliveredPageCount(data?.result.pageCount);
      setDeliveredOrders(data?.result.paginatedResult);
    } catch (error) {
      console.log('Unable to get Delivered orders: ', error);
    }
  };

  const handleUpdateStatusTrue = async (id) => {
    try {
      const response = await axios.put(`https://scan-the-menu.onrender.com/api/v1/orders/delivered/${id}`);
      const data = response.data;
      alert(data.message)

      console.log('Updated Data : ', data);
      if (response.status === 200) {
        handleGetPendingOrders();
        handleGetDeliveredOrders();
      }
    } catch (error) {
      console.log('Unable to set status true or order not found: ', error);
    }
  }

  const handleUpdateStatusFalse = async (id) => {
    try {
      const response = await axios.put(`https://scan-the-menu.onrender.com/api/v1/orders/undoDelivered/${id}`);
      const data = response.data;

      alert(data.message)

      console.log('Updated Data : ', data);
      if (response.status === 200) {
        handleGetPendingOrders();
        handleGetDeliveredOrders();
      }
    } catch (error) {
      console.log('Unable to set status true or order not found: ', error);
    }
  }

  useEffect(() => {

    pendingCurrentPage.current = 1
    deliveredCurrentPage.current = 1

    handleGetPendingOrders();
    handleGetDeliveredOrders();

  }, [showTable])

  return (
    <main className='main'>
      <section className='orders'>
        <div className="chooseOrders">
          <button className={!showTable ? 'orderBtn highlightBtn' : 'orderBtn'} onClick={() => setShowTable(false)}>Pending Orders</button>
          <button className={showTable ? 'orderBtn highlightBtn' : 'orderBtn'} onClick={() => setShowTable(true)}>Delivered Orders</button>
        </div>

        <div className="orderTable">
          {
            showTable ?
              <OrderTable
                receivedOrder={deliveredOrders}
                changeStatus={handleUpdateStatusFalse}
                deliveryLabel='Undo Delivered'
                deliveryIcon={<MdRemoveDone />}
                timestamp={'updatedAt'}
                handlePageClick={handlePageClick}
                pageCount={deliveredPageCount}
              />
              :
              <OrderTable
                receivedOrder={pendingOrders}
                changeStatus={handleUpdateStatusTrue}
                deliveryLabel='Mark Delivered'
                deliveryIcon={<IoMdDoneAll />}
                timestamp={'createdAt'}
                handlePageClick={handlePageClick}
                pageCount={pendingPageCount}
              />
          }

        </div>
      </section>
    </main>
  );
};

export default Orders;

