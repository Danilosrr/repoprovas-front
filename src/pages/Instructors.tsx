import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import api, {
  Test,
  TestByTeacher,
} from "../services/api";

function Instructors() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [teachersDisciplines, setTeachersDisciplines] = useState<
    TestByTeacher[]
  >([]);

  useEffect(() => {
    async function loadPage() {
      if (!token) return;

      const { data: testsData } = await api.getTestsByTeacher(token);
      setTeachersDisciplines(testsData);
    }
    loadPage();
  }, [token]);

  return (
    <>
      <TextField
        sx={{ marginX: "auto", marginBottom: "25px", width: "450px" }}
        label="Pesquise por pessoa instrutora"
      />
      <Divider sx={{ marginBottom: "35px" }} />
      <Box
        sx={{
          marginX: "auto",
          width: "700px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="outlined"
            onClick={() => navigate("/app/disciplinas")}
          >
            Disciplinas
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate("/app/pessoas-instrutoras")}
          >
            Pessoa Instrutora
          </Button>
          <Button variant="outlined" onClick={() => navigate("/app/adicionar")}>
            Adicionar
          </Button>
        </Box>
        <TeachersDisciplinesAccordions
          teachersDisciplines={teachersDisciplines}
        />
      </Box>
    </>
  );
}

interface TeachersDisciplinesAccordionsProps {
  teachersDisciplines: TestByTeacher[];
}

function TeachersDisciplinesAccordions({
  teachersDisciplines,
}: TeachersDisciplinesAccordionsProps) {

  return (
    <Box sx={{ marginTop: "50px" }}>
      {teachersDisciplines.map((teacher) => (
        <Accordion sx={{ backgroundColor: "#FFF" }} key={teacher.id}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="bold">{teacher.name}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            { teacher.tests.length === 0?
              <Typography color="#878787">Nenhuma categoria para essa disciplina</Typography>:
              teacher.tests.map((test,i) => (
                <CategorieAccordions key={teacher.name+'test'+i} tests={test}/>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
interface CategoriesAccordionsProps {
  tests: Test[];
}

function CategorieAccordions({
  tests
}: CategoriesAccordionsProps
) {
  if (tests.length === 0) {
    return (
      <Typography fontWeight="bold">Nenhuma categoria para essa disciplina</Typography>
    )
  }

  return (
    <Accordion sx={{ backgroundColor: "#FFF", boxShadow: "none" }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography fontWeight="bold">{tests[0].category}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        { tests.map( test=>{ return (
          <Typography key={test.id} color="#878787">
            <Link
              href={test.pdfUrl}
              target="_blank"
              underline="none"
              color="inherit"
            >{`${test.name} (${test.teacher})`}</Link>
          </Typography>
        )})  
        }
      </AccordionDetails>
    </Accordion>
  )
}

export default Instructors;