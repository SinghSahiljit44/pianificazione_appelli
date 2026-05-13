import { Injectable, NotFoundException } from '@nestjs/common';
import { DocenteRepository } from './docente.repository';
import { CreateDocenteDto } from './dto/createdocente.dto';
import { UpdateDocenteDto } from './dto/updatedocente.dto';
import { ServerUsersService } from '@server/users';
import { UserRole } from '@server/users';

@Injectable()
export class DocenteService {
  constructor(
    private readonly repository: DocenteRepository,
    private readonly usersService: ServerUsersService,
  ) {}

  async getAppelliIdsByDocenteId(docenteId: number): Promise<number[]> {
    const docente = await this.repository.findById(docenteId);
    if (!docente) throw new NotFoundException(`Docente ${docenteId} non trovato`);
    return docente.appelli.map(a => a.id);
  }

  async getAll() {
    return this.repository.findAll();
  }

  async getByUserId(userId: number) {
    const docente = await this.repository.findByUserId(userId);
    if (!docente) throw new NotFoundException(`Profilo docente non trovato per l'utente ${userId}`);
    return docente;
  }

  async getOne(id: number) {
    const docente = await this.repository.findById(id);
    if (!docente) throw new NotFoundException('Docente non trovato');
    return docente;
  }

  async create(data: CreateDocenteDto) {
    const user = await this.usersService.create({
      name: data.name,
      email: data.email,
      password: data.password,
      role: UserRole.USER,
    });
    return this.repository.create({ titolo: data.titolo, dipartimento: data.dipartimento, userId: user.id });
  }

  async update(id: number, data: UpdateDocenteDto) {
    const docente = await this.repository.findById(id);
    if (!docente) throw new NotFoundException(`Docente ${id} non trovato`);
    return this.repository.update(id, data);
  }

  //Versione più sicura del metodo 
  /*
  async update(id: number, data: UpdateDocenteDto) {
  // Verifichiamo che il docente esista
  await this.getOne(id);

  // Se viene inviato un userId (anche se dici che non succederà, meglio essere sicuri)
  if (data.userId) {
    const existing = await this.repository.findByUserId(data.userId);
    // Se l'ID utente è già occupato da UN ALTRO docente, blocchiamo
    if (existing && existing.id !== id) {
      throw new ConflictException(`L'utente ${data.userId} è già associato a un altro docente.`);
    }
  }
  
  return this.repository.update(id, data);
  }
  */

  async remove(id: number) {
    const docente = await this.repository.findById(id);
    if (!docente) throw new NotFoundException(`Docente ${id} non trovato`);
    return this.repository.delete(id);
  }
}