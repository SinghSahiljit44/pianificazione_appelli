import { Injectable } from "@nestjs/common";
import { AuthGuard } from '@nestjs/passport';

//Evitiamo magic strings, quindi modifico solo qua e non tutte le occorrenze in giro 
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}

