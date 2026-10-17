import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../../components/Button.jsx';
import { TextField } from '../../components/TextField.jsx';
import styles from './LoginForm.module.css';

const esquema = z.object({
  email: z.string().trim().email('Ingresá un email válido.').max(254, 'Ingresá un email válido.'),
  contrasena: z.string().min(1, 'Ingresá tu contraseña.'),
});

/**
 * Formulario del ingreso simulado: email y contraseña, sin verificar la contraseña.
 * @param {{ onIngresar: (email: string) => void }} props
 */
export function LoginForm({ onIngresar }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(esquema), defaultValues: { email: '', contrasena: '' } });

  return (
    <form
      className={styles.formulario}
      noValidate
      onSubmit={handleSubmit((d) => onIngresar(d.email))}
    >
      <p className={styles.nota}>Los campos con * son obligatorios.</p>
      <TextField
        id="email"
        label="Email"
        type="email"
        requerido
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />
      <TextField
        id="contrasena"
        label="Contraseña"
        type="password"
        requerido
        autoComplete="current-password"
        error={errors.contrasena?.message}
        {...register('contrasena')}
      />
      <Button type="submit" anchoCompleto>
        Ingresar
      </Button>
    </form>
  );
}
