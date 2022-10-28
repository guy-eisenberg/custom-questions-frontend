import { api } from '../clients';
import { Customization, DBCustomization } from '../types';

async function getCustomizations(examId: string): Promise<Customization[]> {
  try {
    const { data } = await api.get<DBCustomization[]>(
      `/customizations.php?exam-id=${examId}`
    );

    return data.map((customization) => ({
      ...customization,
      time_added: new Date(`${customization.time_added} UTC`),
      duration: parseInt(customization.duration),
      question_quantity: parseInt(customization.question_quantity),
      copilot_activated: customization.copilot_activated === '1',
    }));
  } catch (err) {
    return Promise.reject(err);
  }
}
export default getCustomizations;
