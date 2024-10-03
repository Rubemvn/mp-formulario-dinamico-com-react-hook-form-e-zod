import { z } from 'zod';

export const userResgisterSchema = z
	.object({
		name: z.string().min(1, { message: 'O campo nome precisa ser preenchido' }),
		email: z
			.string()
			.min(1, { message: 'O campo email precisa ser preenchido' })
			.email({ message: 'Email Inválido' }),
		password: z
			.string()
			.min(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
			.regex(
				/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@#$])[a-zA-Z0-9@#$]{8,50}$/,
				'Formato de senha inválida',
			),
		password_confirmation: z.string().min(8, {
			message: 'A confirmação da senha deve ter no mínimo 8 caracteres',
		}),
		phone: z
			.string()
			.min(1, { message: 'O campo de telefone precisa ser preechido' })
			.regex(/^\(\d{2}\) \d{5}-\d{4}$/, 'Telefone inválido'),
		cpf: z
			.string()
			.min(1, { message: 'O campo de CPF precisa ser preenchido' })
			.regex(/\d{3}\.\d{3}\.\d{3}-\d{2}/, 'CPF inválido'),
		zipcode: z
			.string()
			.min(1, { message: 'O campo de CEP precisa ser preenchido' })
			.regex(/\d{5}-?\d{3}/, 'CEP inválido'),
		address: z.string().min(1, 'O Campo de endereço precisa ser preenchido'),
		city: z.string().min(1, 'O Campo de cidade precisa ser preenchido'),
		terms: z.boolean({ message: 'Você precisa aceitar os termos de uso' }),
	})
	.refine(
		(data) => {
			return data.password === data.password_confirmation;
		},
		{
			message: 'As senhas devem coincidir',
			path: ['password_confirmation'],
		},
	);

export type UserRegister = z.infer<typeof userResgisterSchema>;
