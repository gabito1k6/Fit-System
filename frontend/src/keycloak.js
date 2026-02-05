import Keycloak from 'keycloak-js';

const keycloakConfig = {
    url: 'http://localhost:8080', // URL de tu contenedor Keycloak
    realm: 'gym-realm',           // El reino que creamos
    clientId: 'gym-front'         // El cliente que creamos
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;