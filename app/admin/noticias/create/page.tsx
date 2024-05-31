"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  TextField,
  Button,
  Paper,
  Typography,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import styled from "@emotion/styled";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Layout from "../../../../components/Layout";

const theme = createTheme();

const StyledPaper = styled(Paper)`
  padding: 32px;
  margin-top: 32px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
  border-radius: 4px;
`;

const StyledFormControl = styled(FormControl)`
  margin-top: 16px;
  margin-bottom: 16px;
`;

const StyledButton = styled(Button)`
  margin-top: 24px;
  padding: 12px;
  background-color: rgb(6, 2, 122)};
  color: rgb(0, 0, 0);
`;

const FileInput = styled.input`
  margin-top: 16px;
`;

const TypographyCenter = styled(Typography)`
  margin-bottom: 16px;
  text-align: center;
  font-weight: bold;
`;

const StyledDatePicker = styled(DatePicker)`
  width: 100%;
  padding: 16.5px 14px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.23);
  font-size: 1rem;
  margin-top: 16px;
  margin-bottom: 8px;
  &:hover {
    border-color: rgba(0, 0, 0, 0.87);
  }
`;

const authorOptions = [
  "Presidente Nacional",
  "Vice Presidente para Assuntos Externos",
  "Vice Presidente para Assuntos Internos",
  "Secretário(a) Geral",
  "Diretor Financeiro Interno",
  "Diretor Financeiro Externo",
  "Diretor Nacional de Comunicação e Marketing",
  "Diretor Nacional de Capacity Building",
  "Diretor Nacional de Educação Médica",
  "Diretor Nacional de Saúde Pública",
  "Diretor Nacional de Direitos Humanos e Paz",
  "Diretor Nacional de Direitos Sexuais e Reprodutivos",
  "Diretor Nacional de Intercâmbio Nacional para Assuntos Internos",
  "Diretor Nacional de Intercâmbio Nacional para Assuntos Externos",
  "Diretor Nacional de Intercâmbio Internacional Clínico-Cirúrgico para Incomings",
  "Diretor Nacional de Intercâmbio Internacional Clínico-Cirúrgico para Outgoings",
  "Diretor Nacional de Intercâmbio Internacional de Pesquisa para Incomings",
  "Diretor Nacional de Intercâmbio Internacional de Pesquisa para Outgoings",
  "Diretor Nacional de Programas e Atividades",
  "Diretor Nacional de Publicação, Pesquisa e Extensão",
  "Diretor Nacional de Alumni",
  "Yellow Team",
  "Divisão de Relações Públicas",
  "Red Light Team",
  "Green Lamp Team",
  "White Team",
  "Coordenadores Nacionais de Programas",
  "Scientific Team",
  "Capacity Building Team",
  "Comissão de Reforma e Elaboração de Documentos",
  "National Exchange Team",
  "Time de Intercâmbios Nacionais",
  "NSSB",
  "Outros",
];

export default function CreateNoticia() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [markdown, setMarkdown] = useState("");
  const [resumo, setResumo] = useState("");
  const [author, setAuthor] = useState("");
  const [otherAuthor, setOtherAuthor] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [forcarPaginaInicial, setForcarPaginaInicial] = useState(false);
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    const processedTitle = title
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove accents
      .replace(/[^a-zA-Z0-9 ]/g, "") // Remove non-alphanumeric characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .toLowerCase()
      .slice(0, 15);

    const filename = `${date?.toISOString().split("T")[0]}-${processedTitle}.md`;
    const imageFilename = `img${date?.toISOString().split("T")[0]}-${processedTitle}${image ? image.name.slice(image.name.lastIndexOf(".")) : ""}`;
    const finalAuthor = author === "Outros" ? otherAuthor : author;

    const formData = new FormData();
    formData.append("title", title); // Use the title as typed for CSV
    formData.append("filename", filename); // Use processed filename for markdown
    formData.append("date", date?.toISOString() || "");
    formData.append("markdown", markdown);
    formData.append("resumo", resumo);
    formData.append("author", finalAuthor);
    formData.append("image", image || "");
    formData.append("imageFilename", imageFilename);
    formData.append("forcarPaginaInicial", forcarPaginaInicial ? "sim" : "");

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      alert("Notícia created successfully!");
      router.push("/admin/noticias");
    } else {
      alert("Failed to create notícia");
    }
  };

  return (
    <Layout>
      <Container component="main" maxWidth="md">
        <StyledPaper>
          <TypographyCenter variant="h4" component="h1" gutterBottom>
            Create New Notícia
          </TypographyCenter>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            margin="normal"
          />
          <StyledFormControl fullWidth>
            <InputLabel>Author</InputLabel>
            <Select value={author} onChange={(e) => setAuthor(e.target.value)}>
              {authorOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </StyledFormControl>
          {author === "Outros" && (
            <TextField
              label="Specify Author"
              value={otherAuthor}
              onChange={(e) => setOtherAuthor(e.target.value)}
              fullWidth
              margin="normal"
            />
          )}
          <StyledDatePicker
            selected={date}
            onChange={(newDate) => setDate(newDate)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Select a date"
          />
          <TextField
            label="Resumo"
            value={resumo}
            onChange={(e) => setResumo(e.target.value)}
            inputProps={{ maxLength: 150 }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Markdown"
            multiline
            rows={10}
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            fullWidth
            margin="normal"
          />
          <FileInput type="file" onChange={handleImageChange} />
          <FormControlLabel
            control={
              <Switch
                checked={forcarPaginaInicial}
                onChange={(e) => setForcarPaginaInicial(e.target.checked)}
              />
            }
            label="Forçar Página Inicial"
          />
          <StyledButton variant="contained" onClick={handleSubmit} fullWidth>
            Submit
          </StyledButton>
        </StyledPaper>
      </Container>
    </Layout>
  );
}
