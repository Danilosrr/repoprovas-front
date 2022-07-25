import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  TextField,
  Typography,
  Link
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import api, {
  Discipline,
  Test,
  TestByDiscipline,
} from "../services/api";

function Disciplines() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [terms, setTerms] = useState<TestByDiscipline[]>([]);

  useEffect(() => {
    async function loadPage() {
      if (!token) return;

      const { data: testsData } = await api.getTestsByDiscipline(token);
      setTerms(testsData);
    }
    loadPage();
  }, [token]);

  return (
    <>
      <TextField
        sx={{ marginX: "auto", marginBottom: "25px", width: "450px" }}
        label="Pesquise por disciplina"
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
            variant="contained"
            onClick={() => navigate("/app/disciplinas")}
          >
            Disciplinas
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate("/app/pessoas-instrutoras")}
          >
            Pessoa Instrutora
          </Button>
          <Button variant="outlined" onClick={() => navigate("/app/adicionar")}>
            Adicionar
          </Button>
        </Box>
        <TermsAccordions terms={terms} />
      </Box>
    </>
  );
}

interface TermsAccordionsProps {
  terms: TestByDiscipline[];
}

function TermsAccordions({ terms }: TermsAccordionsProps) {
  return (
    <Box sx={{ marginTop: "50px" }}>
      {terms.map((term) => (
        <Accordion sx={{ backgroundColor: "#FFF" }} key={term.id}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="bold">{term.number} Período</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <DisciplinesAccordions
              disciplines={term.disciplines}
            />
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}

interface DisciplinesAccordionsProps {
  disciplines: Discipline[];
}

function DisciplinesAccordions({
  disciplines
}: DisciplinesAccordionsProps) {
  if (disciplines.length === 0)
    return <Typography>Nenhuma disciplina para esse período...</Typography>;

  return (
    <>
      {disciplines.map((discipline) => (
        <Accordion sx={{ backgroundColor: "#FFF", boxShadow: "none" }} key={discipline.id}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="bold">{discipline.name}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            { discipline.tests.length === 0?
              <Typography color="#878787">Nenhuma categoria para essa disciplina</Typography>:
              discipline.tests.map((test,i) => (
                <CategorieAccordions key={discipline.name+'test'+i} tests={test}/>
            ))}
          </AccordionDetails>
        </Accordion>
      )
      )}
    </>
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
              rel="noopener noreferrer"
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

export default Disciplines;