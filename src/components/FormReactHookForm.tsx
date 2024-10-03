import { EyeIcon, EyeOffIcon, Loader } from 'lucide-react';
import { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { useHookFormMask } from 'use-mask-input';
import { ErrorMessage } from '@hookform/error-message';

export default function Form() {
	const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

	const {
		handleSubmit,
		register,
		setValue,
		setError,
		formState: { isSubmitting, errors },
	} = useForm();

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
				setError(field, { type: 'manual', message: resData.errors[field] });
			}
		} else {
			console.log(resData);
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
					{...register('name', {
						required: 'O campo nome precisa ser preenchido',
						maxLength: {
							value: 255,
							message: 'O nome deve ter no máximo 255 caracteres',
						},
					})}
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
					{...register('email', {
						required: 'O campo email precisa ser preenchido',
						pattern: {
							value: /^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$/,
							message: 'E-mail inválido',
						},
					})}
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
						{...register('password', {
							required: 'O campo de senha precisa ser preenchido',
							minLength: {
								value: 8,
								message: 'A senha deve ter no minímo 6 caracteres',
							},
							pattern: {
								value:
									/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@#$])[a-zA-Z0-9@#$]{8,50}$/,
								message: 'Formato de senha inválida',
							},
						})}
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
						{...register('password_confirmation', {
							required: 'A confirmação da senha precisa ser preenchida',
							minLength: {
								value: 8,
								message: 'A senha deve ter no minímo 6 caracteres',
							},
							validate(value, formValues) {
								if (value === formValues.password) return true;
								return 'As senhas devem coincidir';
							},
						})}
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
					{...registerWithMask('phone', ['(99) 99999-9999'], {
						required: 'O campo de telefone precisa ser preenchido',
						pattern: {
							value: /^\(\d{2}\) \d{5}-\d{4}$/,
							message: 'Telefone inválido',
						},
					})}
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
					{...registerWithMask('cpf', ['999.999.999-99'], {
						required: 'O campo de CPF precisa ser preenchido',
						pattern: {
							value: /\d{3}\.\d{3}\.\d{3}-\d{2}/,
							message: 'CPF inválido',
						},
					})}
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
						required: 'O campo de CEP precisa ser preenchido',
						pattern: {
							value: /\d{5}-?\d{3}/,
							message: 'CEP inválido',
						},
						onBlur: handleZipcodeBlur,
					})}
				/>
				<p className='text-xs text-red-400 mt-1'>
					<ErrorMessage
						name='cep'
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
					{...register('address', {
						required: 'O campo de endereço precisa ser preenchido.',
					})}
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
					{...register('city', {
						required: 'O campo de endereço precisa ser preenchido.',
					})}
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
					{...register('terms', {
						required: 'Os termos e condições devem ser aceitos.',
					})}
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
