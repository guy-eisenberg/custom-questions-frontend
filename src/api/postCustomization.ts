import { api } from '../clients';
import { Customization } from '../types';

async function postCustomization(customization: Customization) {
  try {
    return await api.post('/customizations.php', { customization });
  } catch (err) {
    return Promise.reject(err);
  }
}

export default postCustomization;
