import { EyeIcon, EyeOffIcon, Loader } from 'lucide-react';
import { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { withMask } from 'use-mask-input';

interface IAdress {
	city: string;
	street: string;
}
// import { EyeOffIcon } from 'lucide-react';

export default function Form() {
	const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
	const [address, setAddress] = useState<IAdress>({ city: '', street: '' });

	const handleClick = () => {
		setIsPasswordVisible(!isPasswordVisible);
	};

	async function handleZipcodeBlur(e: React.FocusEvent<HTMLInputElement>) {
		const zipcode = e.target.value;

		const res = await fetch(`https://brasilapi.com.br/api/cep/v1/${zipcode}`);
		const data = await res.json();
		setAddress({ city: data.city, street: data.street });

		// if (res.ok) {
		console.log(address);
		// }
	}

	const {
		handleSubmit,
		register,
		formState: { isSubmitting, errors },
	} = useForm();

	async function onSubmit(data: FieldValues) {
		console.log('Form submitted');
		console.log(data);

		const res = await fetch(
			'https://apis.codante.io/api/register-user/register',
			{
				method: 'POST',
				body: JSON.stringify(data),
			},
		);

		const resData = await res.json();

		console.log(resData);
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
				{errors.name && (
					<p className='text-xs text-red-400 mt-1'>
						{errors.name.message as string}
					</p>
				)}
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
				{errors.email && (
					<p className='text-xs text-red-400 mt-1'>
						{errors.email?.message as string}
					</p>
				)}
			</div>
			{/* Password */}
			<div className='mb-4'>
				<label htmlFor='password'>Senha</label>
				<div className='relative'>
					<input
						type={isPasswordVisible ? 'text' : 'password'}
						{...register('password', {
							required: 'O campo password precisa ser preenchido',
							minLength: {
								value: 6,
								message: 'A senha deve ter no minímo 6 caracteres',
							},
							pattern: {
								value:
									/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@#$])[a-zA-Z0-9@#$]{8,50}$/,
								message: 'Formato de senha inválida',
							},
						})}
					/>
					{errors.password && (
						<p className='text-xs text-red-400 mt-1'>
							{errors.password?.message as string}
						</p>
					)}

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
						name='password'
					/>
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
					ref={withMask('(99) 99999-9999')}
				/>
			</div>
			{/* CPF */}
			<div className='mb-4'>
				<label htmlFor='cpf'>CPF</label>
				<input
					type='text'
					id='cpf'
					ref={withMask('999.999.999-99')}
				/>
			</div>
			{/* CEP */}
			<div className='mb-4'>
				<label htmlFor='cep'>CEP</label>
				<input
					type='text'
					id='cep'
					ref={withMask('99999-999')}
					onBlur={handleZipcodeBlur}
				/>
			</div>
			{/* Address */}
			<div className='mb-4'>
				<label htmlFor='address'>Endereço</label>
				<input
					className='disabled:bg-slate-200'
					type='text'
					id='address'
					disabled
					value={address.street}
				/>
			</div>
			{/* Cidade */}
			<div className='mb-4'>
				<label htmlFor='city'>Cidade</label>
				<input
					className='disabled:bg-slate-200'
					type='text'
					id='city'
					disabled
					value={address.city}
				/>
			</div>
			{/* terms and conditions input */}
			{/* Check */}
			<div className='mb-4'>
				<input
					type='checkbox'
					id='terms'
					className='mr-2 accent-slate-500'
				/>
				<label
					className='text-sm  font-light text-slate-500 mb-1 inline'
					htmlFor='terms'>
					Aceito os{' '}
					<span className='underline hover:text-slate-900 cursor-pointer'>
						termos e condições
					</span>
				</label>
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
