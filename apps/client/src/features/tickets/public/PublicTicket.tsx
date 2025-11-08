import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, Lightbulb } from 'lucide-react';

type PublicTicketType = 'incident' | 'amélioration';

interface PublicTicketForm {
  email: string;
  title: string;
  description: string;
  type: PublicTicketType;
}

const PublicTicket = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<PublicTicketForm>({
    email: '',
    title: '',
    description: '',
    type: 'incident',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Intégrer avec l'API
    console.log('Ticket soumis:', formData);
    
    toast({
      title: "Ticket envoyé avec succès",
      description: "Nous vous contacterons rapidement par email.",
    });

    // Réinitialiser le formulaire
    setFormData({
      email: '',
      title: '',
      description: '',
      type: 'incident',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Soumettre un ticket</CardTitle>
          <CardDescription>
            Signalez un incident ou proposez une amélioration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="votre.email@exemple.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type de ticket *</Label>
              <Select
                value={formData.type}
                onValueChange={(value: PublicTicketType) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="incident">
                    <span className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-destructive" />
                      Incident
                    </span>
                  </SelectItem>
                  <SelectItem value="amélioration">
                    <span className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-warning" />
                      Amélioration
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Titre *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Résumé du problème ou de l'amélioration"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Décrivez en détail l'incident ou l'amélioration souhaitée"
                rows={6}
                required
              />
            </div>

            <Button type="submit" className="w-full" size="lg">
              Envoyer le ticket
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PublicTicket;
