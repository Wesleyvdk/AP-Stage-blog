import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Code, Layout, Server, Smartphone, Palette, Database } from 'lucide-react'

const services = [
  {
    icon: <Layout className="h-10 w-10 text-primary" />,
    title: "Frontend Development",
    description: "Ontwikkeling van responsieve en gebruiksvriendelijke interfaces met moderne frameworks zoals React en Vue.js."
  },
  {
    icon: <Server className="h-10 w-10 text-primary" />,
    title: "Backend Development",
    description: "Bouw van robuuste server-side applicaties en API's met Node.js en Express."
  },
  {
    icon: <Smartphone className="h-10 w-10 text-primary" />,
    title: "Responsive Design",
    description: "Creatie van websites die perfect werken op alle apparaten, van desktop tot mobiel."
  },
  {
    icon: <Code className="h-10 w-10 text-primary" />,
    title: "Clean Code",
    description: "Schrijven van onderhoudbare, goed gedocumenteerde code volgens best practices."
  },
  {
    icon: <Palette className="h-10 w-10 text-primary" />,
    title: "UI/UX Design",
    description: "Ontwerp van intuïtieve gebruikersinterfaces met focus op gebruikerservaring."
  },
  {
    icon: <Database className="h-10 w-10 text-primary" />,
    title: "Database Design",
    description: "Ontwerp en implementatie van efficiënte databasestructuren."
  }
]

export function ServicesSection() {
  return (
    <section className="py-12">
      <div className="container space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Mijn Diensten</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Specialisaties en vaardigheden die ik kan inzetten voor jouw project
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Card key={index} className="border border-border">
              <CardHeader>
                <div className="mb-4">{service.icon}</div>
                <CardTitle>{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{service.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}