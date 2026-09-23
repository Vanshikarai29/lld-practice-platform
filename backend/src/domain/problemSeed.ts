import { Problem } from "./types";

const rubric = [
  { id: "requirements", name: "Requirement Understanding", weight: 15, description: "Captures functional requirements, assumptions and boundaries." },
  { id: "responsibility", name: "Class Responsibilities", weight: 20, description: "Classes have focused, coherent responsibilities." },
  { id: "abstraction", name: "Encapsulation & Abstraction", weight: 15, description: "Interfaces and encapsulation are used where variation or boundaries justify them." },
  { id: "coupling", name: "Coupling & Cohesion", weight: 15, description: "Dependencies are understandable and responsibilities are not unnecessarily coupled." },
  { id: "extensibility", name: "Extensibility", weight: 15, description: "Design can accommodate likely requirement changes without widespread modification." },
  { id: "patterns", name: "Patterns & Trade-offs", weight: 10, description: "Patterns are used intentionally and trade-offs are explained." },
  { id: "edge", name: "Edge Cases & Testability", weight: 10, description: "Important failure paths and testability are considered." }
];

export const problems: Problem[] = [
  {
    id: "parking-lot",
    title: "Design a Parking Lot",
    difficulty: "Medium",
    description: "Design a multi-level parking lot that supports multiple vehicle and parking-spot types, ticketing, allocation, pricing and vehicle exit.",
    requirements: [
      "The parking lot can contain multiple floors.",
      "Vehicles can include motorcycle, car and truck.",
      "Parking spots have compatible types.",
      "A ticket is generated when a vehicle enters.",
      "The system calculates a fee when a vehicle exits.",
      "Pricing should be changeable without rewriting parking allocation.",
      "The design should be testable and extensible."
    ],
    hints: [
      "Separate parking allocation from pricing.",
      "Think about what varies independently.",
      "Avoid putting every responsibility in ParkingLot."
    ],
    rubric
  },
  {
    id: "elevator",
    title: "Design an Elevator System",
    difficulty: "Medium",
    description: "Design an elevator system with multiple elevators, floor requests, direction handling and a dispatch strategy.",
    requirements: [
      "Multiple elevators can serve requests.",
      "Users can request an elevator from a floor.",
      "Users can select a destination floor.",
      "The system should choose an elevator using a dispatch strategy.",
      "Elevators have movement state and direction.",
      "The dispatch algorithm should be replaceable.",
      "The system should handle invalid floor requests."
    ],
    hints: [
      "Model elevator state separately from dispatch.",
      "A strategy is a good candidate for elevator selection.",
      "Consider how an additional dispatch algorithm would be added."
    ],
    rubric
  },
  {
    id: "vending-machine",
    title: "Design a Vending Machine",
    difficulty: "Easy",
    description: "Design a vending machine that manages products, inventory, payments, selection and dispensing.",
    requirements: [
      "Products have prices and quantities.",
      "A user can select a product.",
      "The machine accepts money.",
      "The machine rejects insufficient payment.",
      "The machine returns change.",
      "The machine handles out-of-stock products.",
      "Payment behaviour should be replaceable."
    ],
    hints: [
      "Consider a state-oriented model.",
      "Keep inventory separate from payment logic.",
      "Do not let one class own every business rule."
    ],
    rubric
  },
  {
    id: "library",
    title: "Design a Library Management System",
    difficulty: "Easy",
    description: "Design a library that manages books, copies, members, borrowing, returns and overdue handling.",
    requirements: [
      "A book can have multiple physical copies.",
      "Members can borrow available copies.",
      "A copy cannot be borrowed by two members simultaneously.",
      "Members can return books.",
      "The system identifies overdue loans.",
      "Borrowing rules should be easy to extend.",
      "The design should be easy to test."
    ],
    hints: [
      "Separate book metadata from physical copies.",
      "A loan is a useful domain concept.",
      "Think about policies that may change."
    ],
    rubric
  }
];
