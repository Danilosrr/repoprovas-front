import axios from "axios";

const baseAPI = axios.create({
  baseURL: "http://localhost:5000/",
});

interface UserData {
  email: string;
  password: string;
}

function getConfig(token: string) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

async function signUp(signUpData: UserData) {
  await baseAPI.post("/sign-up", signUpData);
}

async function signIn(signInData: UserData) {
  return baseAPI.post<{ token: string }>("/sign-in", signInData);
}

export interface Term {
  id: number;
  number: number;
}

export interface Discipline {
  id: number;
  name: string;
  tests: [];
}

export interface TeacherDisciplines {
  id: number;
  discipline: Discipline;
  teacher: Teacher;
  tests: Test[];
}

export interface Teacher {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Disciplines {
  discipline: Teacher;
  teacher: Teacher;
}

export interface Test {
  id: number;
  name: string;
  pdfUrl: string;
  category: string;
  teacher: string;
  discipline: string;
}

export type TestByDiscipline = Term & {
  disciplines: Discipline[];
};

export type TestByTeacher = Teacher & {
  tests: Test[][];
};

async function getTestsByDiscipline(token: string) {
  const config = getConfig(token);
  return baseAPI.get< TestByDiscipline[] >(
    "/tests?groupBy=disciplines",
    config
  );
}

async function getTestsByTeacher(token: string) {
  const config = getConfig(token);
  return baseAPI.get< TestByTeacher[] >(
    "/tests?groupBy=teachers",
    config
  );
}

async function getCategories(token: string) {
  const config = getConfig(token);
  return baseAPI.get< Category[] >("/categories", config);
}

async function getDisciplines(token: string) {
  const config = getConfig(token);
  return baseAPI.get< Disciplines[] >("/disciplines", config);
}

async function postTest( testInfo:PostTest, token: string) {
  const config = getConfig(token);
  return await baseAPI.post("/tests", testInfo, config);
}

interface PostTest {
  name: string; 
  pdfUrl: string;
  categoryId: number;
  teacherId: number;
  disciplineId: number;
}

const api = {
  signUp,
  signIn,
  getTestsByDiscipline,
  getTestsByTeacher,
  getCategories,
  getDisciplines,
  postTest
};

export default api;
