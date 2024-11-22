import { Check } from 'lucide-react'

export function PlanDetails({ plan }) {
  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold">{plan.name}</h3>
      <p className="text-xl">{plan.price}</p>
      <ul className="space-y-2">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <Check className="h-5 w-5 text-green-500 mr-2" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

