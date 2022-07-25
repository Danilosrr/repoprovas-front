import {
    Box,
    Button,
    TextField,
    Typography,
    MenuItem,
    Divider,
} from "@mui/material";
import { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAlert from "../hooks/useAlert";
import Form from "../components/Form";
import api, { Category, Disciplines } from "../services/api";
  
const styles = {
    container: {
      width: "460px",
      display: "flex",
      flexDirection: "column",
      textAlign: "center",
    },
    title: { marginBottom: "30px" },
    dividerContainer: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      marginTop: "16px",
      marginBottom: "26px",
    },
    input: { marginBottom: "16px" },
    actionsContainer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
};

interface FormData {
    name: string;
    pdfUrl: string;
    categoryId: string;
    disciplineId: string,
    teacherId: string;
}
  

function Adicionar() {
    const navigate = useNavigate();

    return (
        <>
            <Box sx={{ height: "56px", marginBottom: "25px", width: "450px" }} />
            <Divider sx={{ marginBottom: "35px" }} />
            <Box sx={{ marginX: "auto", width: "700px", marginBottom: "35px"}}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", }}>
                    <Button variant="outlined" onClick={() => navigate("/app/disciplinas")}>
                        Disciplinas
                    </Button>
                    <Button variant="outlined" onClick={() => navigate("/app/pessoas-instrutoras")}>
                        Pessoa Instrutora
                    </Button>
                    <Button variant="contained" onClick={() => navigate("/app/adicionar")}>
                        Adicionar
                    </Button>
                </Box>
                <TestForms/>
            </Box>
        </>
    )
}

function TestForms() {
    const { token } = useAuth();
    const { setMessage } = useAlert();
    const navigate = useNavigate();
    const [categories, setCategories] = useState<Category[]>([]);
    const [disciplines, setDisciplines] = useState<Disciplines[]>([]);


    useEffect(() => {
        async function loadPage() {
          if (!token) return;
          
          const { data: categoriesData } = await api.getCategories(token);
          setCategories(categoriesData);
          const { data:disciplineData } = await api.getDisciplines(token);
          setDisciplines(disciplineData);
        }
        loadPage();
    }, [token]);

    const [formData, setFormData] = useState<FormData>({
      name: '',
      pdfUrl: '',
      categoryId: '',
      disciplineId:'',
      teacherId: '',
    });

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setMessage(null);

        if (!formData?.name || !formData?.pdfUrl || !formData?.categoryId || !formData?.teacherId || !formData?.disciplineId) {
          setMessage({ type: "error", text: "Todos os campos são obrigatórios!" });
          return;
        }
    
        const testInfo = { 
            name: formData.name, 
            pdfUrl: formData.pdfUrl, 
            categoryId: parseInt(formData.categoryId), 
            teacherId: parseInt(formData.teacherId), 
            disciplineId: parseInt(formData.disciplineId), 
        };

        try {
            if(!token) return
            await api.postTest(testInfo,token);
            setMessage({ type: "success", text: "Prova enviada com sucesso!" });
            console.log(formData);
            setFormData({
                name: '',
                pdfUrl: '',
                categoryId: '',
                disciplineId:'',
                teacherId: '',
            })
          } catch (error: Error | AxiosError | any) {
            if (error.response) {
              setMessage({
                type: "error",
                text: error.response.data,
              });
              return;
            }
      
            setMessage({
              type: "error",
              text: "Erro, tente novamente em alguns segundos!",
            });
        }
    }

    return (
        <>

        <Form onSubmit={handleSubmit}>
            <Box sx={styles.container}>
                <Typography sx={styles.title} variant="h4" component="h1">
                Adicione uma prova
                </Typography>

                <TextField
                    name="name"
                    sx={styles.input}
                    label="Name"
                    type="text"
                    variant="outlined"
                    onChange={handleInputChange}
                    value={formData.name}
                />
                <TextField
                    type='url'
                    placeholder="https://..."
                    name="pdfUrl"
                    sx={styles.input}
                    label="pdf url"
                    onChange={handleInputChange}
                    value={formData.pdfUrl}
                />
                <TextField
                    select
                    name="categoryId"
                    sx={styles.input}
                    label="Category"
                    onChange={handleInputChange}
                    value={formData.categoryId}
                >
                    { categories.map((category) => (
                        <MenuItem key={category.id} value={`${category.id}`}>
                            {category.name}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    select
                    name="disciplineId"
                    sx={styles.input}
                    label="Discipĺine"
                    onChange={handleInputChange}
                    value={formData.disciplineId}
                >
                    {disciplines.map((discipline) => (
                        <MenuItem key={discipline.discipline.name} value={`${discipline.discipline.id}`}>
                            {discipline.discipline.name}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    select
                    name="teacherId"
                    sx={styles.input}
                    label="Teacher"
                    onChange={handleInputChange}
                    value={formData.teacherId}
                    disabled={!formData.disciplineId}
                >
                    {
                    disciplines.filter( el => el.discipline.id===+formData.disciplineId).map((discipline) => (
                        <MenuItem key={discipline.teacher.name} value={`${discipline.teacher.id}`}>
                            {discipline.teacher.name}
                        </MenuItem>
                    ))}
                </TextField>
                <Box sx={styles.actionsContainer}>

                <Button variant="contained" type="submit">
                    Enviar
                </Button>
                </Box>
            </Box>
        </Form>
        </>
    );
}

export default Adicionar