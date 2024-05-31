"use client";

import { useState, useEffect } from "react";
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
import { TypographyProps } from '@mui/material/Typography';

const theme = createTheme({
  palette: {
    primary: {
      main: "#6200ea",
    },
    secondary: {
      main: "#03dac6",
    },
  },
  typography: {
    fontFamily: "Poppins, sans-serif",
  },
});

const StyledPaper = styled(Paper)`
  padding: 40px;
  margin-top: 40px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.16);
  border-radius: 8px;
  background-color: #fff;
`;

const StyledFormControl = styled(FormControl)`
  margin-top: 24px;
  margin-bottom: 24px;
`;

const StyledButton = styled(Button)`
  margin-top: 32px;
  padding: 14px;
  font-size: 16px;
  background-color: #6200ea;
  color: #fff;
  &:hover {
    background-color: #3700b3;
  }
`;

const FileInput = styled.input`
  margin-top: 24px;
`;

const TypographyCenter = styled((props: TypographyProps) => (
  <Typography {...props} />
))`
  margin-bottom: 24px;
  text-align: center;
  font-weight: bold;
  color: #6200ea;
`;

const StyledDatePicker = styled(DatePicker)`
  width: 100%;
  padding: 16.5px 14px;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.23);
  font-size: 1rem;
  margin-top: 24px;
  margin-bottom: 16px;
  &:hover {
    border-color: rgba(0, 0, 0, 0.87);
  }
`;

const ImagePreview = styled.img`
  width: 100%;
  max-width: 300px;
  margin-top: 24px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.16);
`;

const authorOptions: string[] = [
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
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [forcarPaginaInicial, setForcarPaginaInicial] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(image);
    } else {
      setImagePreview(null);
    }
  }, [image]);

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
    <ThemeProvider theme={theme}>
      <Layout>
        <Container component="main" maxWidth="md">
          <StyledPaper>
            <TypographyCenter variant="h4" component="h1" gutterBottom>
              Criar nova notícia
            </TypographyCenter>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
            />
            <StyledFormControl fullWidth>
              <InputLabel>Author</InputLabel>
              <Select
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                variant="outlined"
              >
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
                variant="outlined"
              />
            )}
            <StyledDatePicker
              selected={date}
              onChange={(newDate: Date | null) => setDate(newDate || undefined)}
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
              variant="outlined"
            />
            <TextField
              label="Markdown"
              multiline
              rows={10}
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
            />
            <Typography variant="h6" component="p" gutterBottom>
              Image Upload
            </Typography>
            <FileInput type="file" onChange={handleImageChange} />
            {imagePreview && (
              <ImagePreview src={imagePreview} alt="Image Preview" />
            )}
            <FormControlLabel
              control={
                <Switch
                  checked={forcarPaginaInicial}
                  onChange={(e) => setForcarPaginaInicial(e.target.checked)}
                  color="primary"
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
    </ThemeProvider>
  );
}