import { functions as authFunctions } from './auth';
import { functions as infraFunctions } from './infra';

const lambdas = { ...authFunctions, ...infraFunctions };

export default lambdas;
