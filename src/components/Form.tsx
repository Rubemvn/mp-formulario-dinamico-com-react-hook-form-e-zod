import { EyeIcon, EyeOffIcon, Loader } from 'lucide-react';
import { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { useHookFormMask } from 'use-mask-input';
import { ErrorMessage } from '@hookform/error-message';
import { zodResolver } from '@hookform/resolvers/zod';
import type { UserRegister } from '../schema';
import { userResgisterSchema } from '../schema';
import toast from 'react-hot-toast';

export default function Form() {
	const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

	const {
		handleSubmit,
		register,
		setValue,
		setError,
		reset,
		formState: { isSubmitting, errors },
	} = useForm<UserRegister>({
		resolver: zodResolver(userResgisterSchema),
	});

	const handleClick = () => {
		setIsPasswordVisible(!isPasswordVisible);
	};

	async function handleZipcodeBlur(e: React.FocusEvent<HTMLInputElement>) {
		const zipcode = e.target.value;

		const res = await fetch(`https://brasilapi.com.br/api/cep/v1/${zipcode}`);
		const data = await res.json();
		setValue('address', data.street);
		setValue('city', data.city);
	}

	const registerWithMask = useHookFormMask(register);

	async function onSubmit(data: FieldValues) {
		console.log('Form submitted');
		console.log(data);

		const res = await fetch(
			'https://apis.codante.io/api/register-user/register',
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			},
		);
		const resData = await res.json();

		if (!res.ok) {
			console.log(resData);
			for (const field in resData.errors) {
				setError(field as keyof UserRegister, {
					type: 'manual',
					message: resData.errors[field],
				});
			}
			toast.error('Erro ao cadastrar usuário');
		} else {
			toast.success('Usuário cadastrado com sucesso');
			reset();
		}
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			{/* Name */}
			<div className='mb-4'>
				<label htmlFor='name'>Nome Completo</label>
				<input
					type='text'
					id='name'
					{...register('name')}
				/>
				{/* Sugestão de exibição de erro de validação */}
				<p className='text-xs text-red-400 mt-1'>
					<ErrorMessage
						name='name'
						errors={errors}
					/>
				</p>
			</div>
			{/* E-mail */}
			<div className='mb-4'>
				<label htmlFor='email'>E-mail</label>
				<input
					className=''
					type='email'
					id='email'
					{...register('email')}
				/>
				<p className='text-xs text-red-400 mt-1'>
					<ErrorMessage
						name='email'
						errors={errors}
					/>
				</p>
			</div>
			{/* Password */}
			<div className='mb-4'>
				<label htmlFor='password'>Senha</label>
				<div className='relative'>
					<input
						type={isPasswordVisible ? 'text' : 'password'}
						{...register('password')}
					/>
					<p className='text-xs text-red-400 mt-1'>
						<ErrorMessage
							name='password'
							errors={errors}
						/>
					</p>

					<span className='absolute right-3 top-3'>
						{/* Button show/hidden password */}
						<button
							type='button'
							onClick={handleClick}>
							{isPasswordVisible ? (
								<EyeIcon
									size={20}
									className='text-slate-600 cursor-pointer'
								/>
							) : (
								<EyeOffIcon
									className='text-slate-600 cursor-pointer'
									size={20}
								/>
							)}
						</button>
						{/*  */}
					</span>
				</div>
			</div>
			{/* Confirm */}
			<div className='mb-4'>
				<label htmlFor='confirm-password'>Confirmar Senha</label>
				<div className='relative'>
					<input
						type={isPasswordVisible ? 'text' : 'password'}
						{...register('password_confirmation')}
					/>
					<p className='text-xs text-red-400 mt-1'>
						<ErrorMessage
							name='password_confirmation'
							errors={errors}
						/>
					</p>
					<span className='absolute right-3 top-3'>
						<button
							type='button'
							onClick={handleClick}>
							{isPasswordVisible ? (
								<EyeIcon
									size={20}
									className='text-slate-600 cursor-pointer'
								/>
							) : (
								<EyeOffIcon
									className='text-slate-600 cursor-pointer'
									size={20}
								/>
							)}
						</button>
						{/*  */}
					</span>
				</div>
			</div>
			{/* Phone */}
			<div className='mb-4'>
				<label htmlFor='phone'>Telefone Celular</label>
				<input
					type='text'
					id='phone'
					{...registerWithMask('phone', ['(99) 99999-9999'])}
				/>
				<p className='text-xs text-red-400 mt-1'>
					<ErrorMessage
						name='phone'
						errors={errors}
					/>
				</p>
			</div>
			{/* CPF */}
			<div className='mb-4'>
				<label htmlFor='cpf'>CPF</label>
				<input
					type='text'
					id='cpf'
					{...registerWithMask('cpf', ['999.999.999-99'])}
				/>
				<p className='text-xs text-red-400 mt-1'>
					<ErrorMessage
						name='cpf'
						errors={errors}
					/>
				</p>
			</div>
			{/* CEP */}
			<div className='mb-4'>
				<label htmlFor='cep'>CEP</label>
				<input
					type='text'
					id='cep'
					// onBlur={handleZipcodeBlur}
					{...registerWithMask('zipcode', ['99999-999'], {
						onBlur: handleZipcodeBlur,
					})}
				/>
				<p className='text-xs text-red-400 mt-1'>
					<ErrorMessage
						name='zipcode'
						errors={errors}
					/>
				</p>
			</div>
			{/* Address */}
			<div className='mb-4'>
				<label htmlFor='address'>Endereço</label>
				<input
					className='disabled:bg-slate-200'
					type='text'
					id='address'
					disabled
					{...register('address')}
				/>
				<p className='text-xs text-red-400 mt-1'>
					<ErrorMessage
						name='address'
						errors={errors}
					/>
				</p>
			</div>
			{/* Cidade */}
			<div className='mb-4'>
				<label htmlFor='city'>Cidade</label>
				<input
					className='disabled:bg-slate-200'
					type='text'
					id='city'
					disabled
					{...register('city')}
				/>
				<p className='text-xs text-red-400 mt-1'>
					<ErrorMessage
						name='city'
						errors={errors}
					/>
				</p>
			</div>
			{/* terms and conditions input */}
			{/* Check */}
			<div className='mb-4'>
				<input
					type='checkbox'
					id='terms'
					className='mr-2 accent-slate-500'
					{...register('terms')}
				/>

				<label
					className='text-sm  font-light text-slate-500 mb-1 inline'
					htmlFor='terms'>
					Aceito os{' '}
					<span className='underline hover:text-slate-900 cursor-pointer'>
						termos e condições
					</span>
				</label>
				<p className='text-xs text-red-400 mt-1'>
					<ErrorMessage
						name='terms'
						errors={errors}
					/>
				</p>
			</div>
			{/* Submit */}
			<button
				type='submit'
				disabled={isSubmitting}
				className='bg-slate-500 font-semibold text-white w-full rounded-xl p-4 mt-10 hover:bg-slate-600 transition-colors disabled:bg-slate-950 flex items-center justify-center'>
				{isSubmitting ? (
					<>
						<Loader className='animate-spin' /> Carregando...
					</>
				) : (
					'Cadastrar'
				)}
			</button>
		</form>
	);
}
