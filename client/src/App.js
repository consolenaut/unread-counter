import React, { useEffect, useState } from "react";
import styled from "styled-components";
import socketIOClient from "socket.io-client";

const endpoint = process.env.REACT_APP_SERVER_ENDPOINT || "http://192.168.174.6:4001" || "http://unread-counter-dotblack.dotblack.io";

const AppContainer = styled.div`
  text-align: center;
`;

const Header = styled.div`
  background-color: #000;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const CountContainer = styled.div`
  position: fixed;

  top: 50%;
  margin-top: -234px;
  left: 50%;
  margin-left: -251px;

  width: 482px;
  height: 482px !important;
  background: ${({ unreads }) => unreads ? "#B70014" : "#000"};
  border-radius: 50%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Count = styled.h1`
  color: #fff;
  font-size: 200px;
  line-height: 1em;
  text-align: center;
`;

const App = () => {
  const [response, setResponse] = useState(false);
  useEffect(() => {
    const socket = socketIOClient(endpoint);
    socket.on("FromAPI", data => setResponse(data));
  }, []);

  return (
    <AppContainer>
      <Header>
        <CountContainer unreads={response}>
          <Count>{response ? response : "?"}</Count>
        </CountContainer>
      </Header>
    </AppContainer>
  );
}

export default App;