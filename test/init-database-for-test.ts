import { LoginService, ROOT_EMAIL, DEFAULT_PASSWORD } from "../src/refs";

export class InitDatabaseForTest {
    static async loginRootAccount() {
        return await LoginService.login(ROOT_EMAIL, undefined, DEFAULT_PASSWORD);
    }
}