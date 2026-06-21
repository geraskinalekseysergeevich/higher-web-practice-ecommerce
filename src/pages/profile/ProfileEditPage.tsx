import { Button, Form, FormField, Input } from '../../components/ui'

export function ProfileEditPage() {
  return (
    <Form
      description="Черновой каркас редактирования профиля без бизнес-логики."
      onSubmit={(event) => event.preventDefault()}
      title="Редактирование профиля"
    >
      <FormField label="Имя" requiredMark>
        <Input autoComplete="given-name" name="firstName" />
      </FormField>

      <FormField label="Фамилия" requiredMark>
        <Input autoComplete="family-name" name="lastName" />
      </FormField>

      <FormField label="Email" requiredMark>
        <Input autoComplete="email" name="email" />
      </FormField>

      <FormField label="Пароль">
        <Input autoComplete="new-password" name="password" type="password" />
      </FormField>

      <Button type="submit">Сохранить изменения</Button>
    </Form>
  )
}
