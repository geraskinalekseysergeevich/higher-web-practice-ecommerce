import { Button, Form, FormField, Input } from '../../components/ui'

export function LoginPage() {
  return (
    <Form
      description="Минимальный каркас формы входа для будущей валидации и авторизации."
      onSubmit={(event) => event.preventDefault()}
      title="Вход"
    >
      <FormField label="Email" requiredMark>
        <Input autoComplete="email" name="email" placeholder="name@example.com" />
      </FormField>

      <FormField label="Пароль" requiredMark>
        <Input autoComplete="current-password" name="password" type="password" />
      </FormField>

      <Button type="submit">Войти</Button>
    </Form>
  )
}
