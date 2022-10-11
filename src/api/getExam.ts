import { DBExam } from '../types/real';

async function getExam(examId: string): Promise<DBExam> {
  const res = await fetch(
    `http://guy-eisenberg.local/wp-json/cq/v1/exams/${examId}`
  );

  if (!res.ok) return Promise.reject(`${res.status}: ${res.statusText}`);

  return res.json();
}

export default getExam;
