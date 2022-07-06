import { useState, useEffect } from "react";
import styled from "styled-components";

import { fetchPrices } from "./api";

const transformData = (data) => {
  const { slug, symbol, metrics, id } = data;
  return {
    id,
    currencyName: slug,
    symbol,
    currentPrice: metrics.market_data.price_usd.toFixed(2),
    userQty: null,
  };
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align=items: center;
  margin: auto;
`;
const Table = styled.div`
  display: flex;
  justify-content: center;
  align=items: center;
  margin: auto;
  width: 90%;
`;
const rowRenderer = (data, onChange) => {
  // console.log("data", data);
  return (
    data &&
    data.map((element) => {
      const keys = Object.keys(element);
      return (
        <tr>
          {keys.map((el) => {
            if (el === "userQty")
              return (
                <input
                  key={element["id"]}
                  value={element[el]}
                  placeholder="Enter Quantity"
                  onChange={(evt) => onChange(evt, element["id"])}
                />
              );
            else if (el !== "id") return <td>{element[el]}</td>;
            return null;
          })}
        </tr>
      );
    })
  );
};
function App() {
  const [currencies, setCurrencies] = useState(null);
  const [wallet, setWallet] = useState(1000);
  useEffect(() => {
    fetchPrices().then((res) => {
      const { data } = res;

      const currencies = data && data.map((item) => transformData(item));
      setCurrencies(currencies);
    });
  }, []);
  const onPriceChange = (evt, id) => {
    const qty = evt.target.value;

    setCurrencies((currencies) =>
      currencies.map((el) => {
        return {
          ...el,
          userQty: id === el.id ? qty : el.userQty,
        };
      })
    );
  };
  const buyNow = () => {
    const totalCost = currencies.reduce((a, c) => {
      return (a += c.userQty * c.currentPrice);
    }, 0);

    if (wallet >= totalCost) {
      setWallet(wallet - totalCost);
    }
    setCurrencies((currencies) =>
      currencies.map((el) => {
        return {
          ...el,
          userQty: 0,
        };
      })
    );
  };
  return (
    <Container>
      <Table>
        <table>
          <thead style={{ margin: 10, padding: 10 }}>
            <td>Currency Name</td>
            <td>Symbol</td>
            <td>Curent Price</td>
            <td>User Qty</td>
          </thead>
          <tbody>{rowRenderer(currencies, onPriceChange)}</tbody>
        </table>
      </Table>

      <div>
        <h1>
          Wallet : <p>{wallet}</p>
        </h1>
        <button onClick={buyNow}>buy now</button>
      </div>
    </Container>
  );
}

export default App;
