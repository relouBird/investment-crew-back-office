// Définition des types d'événements (optionnel, mais recommandé)
export type EventPayment = {
  id: string;
  status: number;
};
// Fonction...
type FunctionEventPayment = (data: EventPayment) => void;

export type EventsProps = {
  "payment:started": FunctionEventPayment | EventPayment;
  "payment:status": void;
};


///  Timer type

export type TimeProps = {
  date: string | Date;
  time: string;
};

export interface DatePropsInterface {
  start: TimeProps;
  end: TimeProps;
}