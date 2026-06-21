import { Button, Form, FormField, Input } from '../../components/ui'

export function RegisterPage() {
  return (
    <Form
      description="Минимальный каркас формы регистрации с обязательными полями."
      onSubmit={(event) => event.preventDefault()}
      title="Регистрация"
    >
      <FormField label="Имя" requiredMark>
        <Input autoComplete="given-name" name="firstName" />
      </FormField>

      <FormField label="Фамилия" requiredMark>
        <Input autoComplete="family-name" name="lastName" />
      </FormField>

      <FormField label="Email" requiredMark>
        <Input autoComplete="email" name="email" placeholder="name@example.com" />
      </FormField>

      <FormField label="Пароль" requiredMark>
        <Input autoComplete="new-password" name="password" type="password" />
      </FormField>

      <FormField label="Подтверждение пароля" requiredMark>
        <Input autoComplete="new-password" name="confirmPassword" type="password" />
      </FormField>

      <Button type="submit">Создать аккаунт</Button>
    </Form>
  )
}
