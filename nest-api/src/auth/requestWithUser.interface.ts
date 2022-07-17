import { Request } from 'express';
import { UserInterface } from 'src/shared/interfaces/user.interface';

interface RequestWithUser extends Request {
  user: UserInterface;
}

export default RequestWithUser;
