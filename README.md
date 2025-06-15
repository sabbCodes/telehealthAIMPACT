# TeleHealthSol - Web3 Telemedicine Platform

**Live Demo:** [[Demo On Aimpact](https://a0805ea7-3983-45a3-8c12-a0750c4f57a5.deployment.aimpact.dev/)]
**GitHub:** [[Github Repo](https://github.com/sabbCodes/telehealthAIMPACT)]

## Overview

TeleHealthSol is a decentralized telemedicine platform built on Solana blockchain that revolutionizes healthcare delivery by combining secure video consultations with blockchain-powered medical records management.

## Quick Start

For testing purposes, you can use the following Doctor demo account:

```
Email: sabbn1@gmail.com
Password: sabbn1@gmail.com
```

Create a patient account, that doesn't require verification.

## Key Features

### 1. Secure Video Consultations

- End-to-end encrypted video calls between doctors and patients
- Real-time chat functionality with message persistence
- Appointment scheduling with Solana-powered payments

### 2. Blockchain-Powered Medical Records

- On-chain storage of encrypted health records
- Patient-controlled access to medical history
- Secure sharing of records with authorized healthcare providers
- Immutable audit trail of all medical interactions

### 3. Smart Contract Integration

- Automated payment escrow system
- Transparent fee structure
- Instant settlement of consultations
- Programmable healthcare agreements

### 4. AI-Powered Triage

- Symptom assessment and routing
- Doctor-patient matching
- Emergency response prioritization

### 5. Global Healthcare Access

- Borderless medical consultations
- Multi-language support
- 24/7 availability across time zones
- Reduced healthcare costs through blockchain efficiency

## Technical Stack

- Frontend: React, TypeScript, TailwindCSS
- Blockchain: Solana, Anchor Framework
- Backend: Supabase
- Real-time: WebSocket, Supabase Realtime
- Authentication: Solana Wallet, Supabase Auth

## Security Features

- End-to-end encryption for all communications
- Zero-knowledge proof for sensitive data
- Decentralized identity management
- Immutable audit logs
- HIPAA-compliant data handling

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- pnpm (v8 or higher)
- Solana CLI tools
- Anchor Framework
- Git

### Local Development Setup

1. Clone the repository:

```bash
git clone [repository-url]
cd telehealthsol
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
VITE_HEALTH_RECORDS_PROGRAM_ID=your_solana_program_id
```

4. Start the development server:

```bash
pnpm dev
```

5. Open your browser and navigate to `http://localhost:5173`

### Testing the Application

1. **Using Demo Account**

   - Use the provided demo account credentials to log in
   - This account has full doctor privileges
   - All features are available for testing

2. **Creating New Accounts**

   - You can create new patient accounts directly
   - New doctor accounts require verification (2-3 business days)
   - Use the demo account to test doctor features immediately

3. **Testing Features**
   - Video consultations
   - Real-time chat
   - Appointment scheduling
   - Medical records management
   - Payment processing

### Building for Production

```bash
pnpm build
```

## Project Structure

```
src/
├── components/     # React components
├── lib/           # Utility functions and configurations
├── pages/         # Page components
├── store/         # State management
├── types/         # TypeScript type definitions
└── utils/         # Helper functions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Future Roadmap

- Integration with medical IoT devices
- Expansion of AI capabilities
- Cross-chain interoperability
- Mobile application development
- Insurance protocol integration

## Contact

[Add contact information]

## Acknowledgments

- [Add acknowledgments]
