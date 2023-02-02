import { type } from "@testing-library/user-event/dist/type";
import { useEffect, useState } from "react";
import {
  Button,
  Container,
  Form,
  InputGroup,
  Nav,
  Navbar,
  Table,
} from "react-bootstrap";
import "./App.css";
import api from "./service/api";

function App() {
  const [hardwares, setHardwares] = useState([]);

  const [selecionado, setSelecionado] = useState({});

  const [atualizar, setAtualizar] = useState(false);

  const [componente, setComponente] = useState("");
  const [marca, setMarca] = useState("");
  const [nome, setNome] = useState("");
  const [versao, setVersao] = useState("");
  const [preco, setPreco] = useState();

  useEffect(() => {
    buscarHardware();
  }, []);

  async function buscarHardware() {
    await api.get("/hardware").then((response) => {
      setHardwares(response.data);
    });
  }

  async function cadastrarHardware() {
    const cadastroHardware = {
      componente,
      marca,
      nome,
      versao,
      preco: parseFloat(preco),
    };

    await api
      .post("/hardware", cadastroHardware)
      .then((response) => {
        setHardwares([...hardwares, response.data]);
        alert("hardware registrado com sucesso!");
        limparForm();
        buscarHardware();
      })
      .catch(() => {
        alert("hardware já cadastrado no sistema!");
      });
  }
  // Put - atualização
  async function atualizarHardware() {
    const atualizarHardware = {
      componente,
      marca,
      nome,
      versao,
      preco: parseFloat(preco),
    };

    await api
      .put("/hardware", atualizarHardware)
      .then((response) => {
        setHardwares([...hardwares, response.data]);
        alert("hardware atualizado com sucesso!");
        limparForm();
        buscarHardware();
      })
      .catch(() => {
        alert("hardware não atualizado!");
      });
  }

  function limparForm() {
    setComponente("");
    setMarca("");
    setNome("");
    setVersao("");
    setPreco("");
  }

  async function excluirHardware(versao) {
    await api.delete(`/hardware/${versao}`).then(() => {
      buscarHardware();
      alert("hardware excluido da listagem");
    });
  }

  console.log(preco);

  function editarSelecionado(item) {
    setAtualizar(true);
    setSelecionado(item);
  }

  useEffect(() => {
    setComponente(selecionado.componente);
    setMarca(selecionado.marca);
    setNome(selecionado.nome);
    setVersao(selecionado.versao);
    setPreco(selecionado.preco);
  }, [selecionado]);

  return (
    <div className="containerGeral">
      <Navbar className="Navbar" bg="dark" variant="dark">
        <Container className="NavInfo">
          <Navbar.Brand href="#home">Hardware Local Database</Navbar.Brand>
          
          <Nav>
            <Nav.Link
              href="https://www.jcavitreinamentos.com.br/cursos-programacao?gclid=CjwKCAiAuOieBhAIEiwAgjCvcg6MskGzZYf_f2mICk5EakZcf0JCTIwDR0TKgmORpzFu5EcJFQbh6hoC2JgQAvD_BwE"
              target="_blank"
            >
              JCAVI
            </Nav.Link>
            <Nav.Link href="https://github.com/richardsoledade" target="_blank">
              Meu GitHub
            </Nav.Link>
            <Nav.Link
              href="https://www.behance.net/richardsoledade"
              target="_blank"
            >
              Behance
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <div className="container">
        <header className="App-header">
          {atualizar
            ? `Atualizando o cadastro do item ${selecionado.nome}`
            : "Cadastre seu hardware"}
        </header>

        <hr></hr>

        <div className="cadastroInp">
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Componente"
              value={componente}
              onChange={(e) => {
                setComponente(e.target.value);
              }}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Marca do hardware"
              value={marca}
              onChange={(e) => {
                setMarca(e.target.value);
              }}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Nome do hardware"
              value={nome}
              onChange={(e) => {
                setNome(e.target.value);
              }}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Versão do hardware"
              value={versao}
              onChange={(e) => {
                setVersao(e.target.value);
              }}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Preço do hardware"
              value={preco}
              type="number"
              onChange={(e) => {
                setPreco(e.target.value);
              }}
            />
          </InputGroup>
          {atualizar ? (
            <>
              <Button variant="dark" size="md" className="botao" onClick={atualizarHardware}>Atualizar</Button>
              <Button variant="dark" size="md"
                onClick={() => {
                  setAtualizar(false);
                  setSelecionado({});
                  limparForm();
                }}
              >
                Novo Cadastro
              </Button>
            </>
          ) : (
            <Button variant="dark" onClick={cadastrarHardware}>Cadastrar</Button>
            
          )}
          
        </div>
      </div>

      <Table className ="container"striped bordered hover>
        <thead>
          <tr>
            <th>id</th>
            <th>Componente</th>
            <th>Marca</th>
            <th>Nome</th>
            <th>Versao</th>
            <th>Preço</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {hardwares.map((h) => {
            return (
              <tr>
                <td>{h.id}</td>
                <td>{h.componente}</td>
                <td>{h.marca}</td>
                <td>{h.nome}</td>
                <td>{h.versao}</td>
                <td>R$ {h.preco}</td>
                <td>
                  <Button variant="dark" size="sm"className="botao"onClick={() => excluirHardware(h.versao)}>X</Button>
                  <Button variant="dark" size="sm" className="botao" onClick={() => editarSelecionado(h)}>Edit</Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

          <hr></hr>


      <footer>

          <h6>Projeto Back e FrontEnd de aula JCAVI</h6>

      </footer>
    </div>
  );
}

export default App;
