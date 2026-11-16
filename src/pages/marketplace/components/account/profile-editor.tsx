import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label, RequiredMark } from '@/components/ui/label'

const profileFields = [
  'Nome de exibição',
  'Nome de usuário',
  'E-mail',
  'Nome ENS',
  'Apelido da carteira',
]

function ProfileField({ field }: { field: string }) {
  const id = field.toLocaleLowerCase('pt-BR').replaceAll(' ', '-')
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {field}
        <RequiredMark />
      </Label>
      <Input id={id} type={field === 'E-mail' ? 'email' : 'text'} variant="account" />
    </div>
  )
}

export function ProfileEditor() {
  return (
    <section aria-labelledby="collector-profile-title">
      <h2 id="collector-profile-title" className="text-xl font-semibold">
        Perfil do colecionador
      </h2>
      <form onSubmit={(event) => event.preventDefault()} className="mt-6">
        <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
          {profileFields.map((field) => (
            <ProfileField key={field} field={field} />
          ))}
        </div>
        <section aria-labelledby="change-password-title" className="mt-10 max-w-2xl">
          <h3 id="change-password-title" className="text-lg font-semibold">
            Alterar senha
          </h3>
          <div className="mt-5 grid gap-x-6 gap-y-5 sm:grid-cols-2">
            {['Senha atual', 'Nova senha', 'Confirmar nova senha'].map((field) => (
              <div key={field} className="space-y-2">
                <Label htmlFor={`password-${field}`}>
                  {field}
                  <RequiredMark />
                </Label>
                <Input id={`password-${field}`} type="password" variant="account" />
              </div>
            ))}
          </div>
        </section>
        <Button type="submit" className="mt-8 h-10 min-w-36">
          Salvar alterações
        </Button>
      </form>
    </section>
  )
}
