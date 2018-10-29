import { LoginService, ROOT_EMAIL, DEFAULT_PASSWORD, ROOT_PHONE } from "../src/refs";

export class InitDatabaseForTest {
    static async loginRootAccount() {
        return await LoginService.login(ROOT_PHONE, undefined, DEFAULT_PASSWORD);
    }
}