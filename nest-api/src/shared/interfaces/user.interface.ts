export interface UserInterface extends Document {
  readonly first_name: string;
  readonly last_name: string;
  readonly email: string;
  readonly password: string;
  readonly created_on: string;
  readonly updated_on: string;
  readonly currentHashedRefreshToken: string;
}
