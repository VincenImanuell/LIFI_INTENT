import Section from './Section'
import AnnotatedJson from './AnnotatedJson'

const SAMPLE_ORDER = {
  user: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
  nonce: '1',
  originChainId: '8453',
  expires: 1716998400,
  fillDeadline: 1716998280,
  inputOracle: '0x0000003E06000007A224AeE90052fA6bb46d43C9',
  inputs: [
    ['0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', '10000000'],
  ],
  outputs: [
    {
      oracle: '0x0000003E06000007A224AeE90052fA6bb46d43C9',
      settler: '0x0000000000eC36B683C2E6AC89e9A75989C22a2e',
      chainId: '42161',
      token: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
      amount: '9950000',
      recipient: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      call: '0x',
      context: '0xe0' + '0'.repeat(64) + Math.floor(Date.now() / 1000 + 60).toString(16).padStart(8, '0'),
    },
  ],
}

const ANNOTATIONS = {
  user: 'Owner of the intent. Receives a refund if the order expires unfilled.',
  nonce: 'Replay protection. Per-sponsor for escrow flows, per-allocator for Compact flows.',
  originChainId: 'EIP-155 chain id where the user is locking their input tokens.',
  expires: 'Hard refund deadline. After this, the user can claw the input back.',
  fillDeadline: 'Solvers must complete fill() before this timestamp. Always < expires.',
  inputOracle: 'Oracle contract that will verify the destination fill back on origin.',
  inputs: 'Tuples of [token, amount] the user is committing on the origin chain.',
  outputs: 'List of MandateOutputs the solver must deliver to settle the order.',
  oracle: 'Output-side oracle that will attest to delivery. Pairs with inputOracle.',
  settler: 'OutputSettler contract on the destination chain. OIF default = CoinFiller.',
  chainId: 'Destination chain id.',
  token: 'Destination token contract address.',
  amount: 'Base units the solver must deliver to the recipient.',
  recipient: 'Final receiver of the output on the destination chain.',
  call: 'Optional calldata forwarded to recipient.orderFinalised(). "0x" = nothing.',
  context: 'Auction type encoding. 0x = limit, 0xe0… = exclusive limit, 0x01… = Dutch, 0xe1… = exclusive Dutch.',
}

const KEY_NOTES = [
  {
    title: 'Escrow vs. Compact',
    body: (
      <>
        The same <code className="font-mono text-zinc-300">StandardOrder</code> shape is used in both
        flows. In Escrow, the user signs nothing — the act of calling{' '}
        <code className="font-mono text-zinc-300">open()</code> is the commitment. In Compact, the
        order is wrapped in a <code className="font-mono text-zinc-300">BatchCompact</code> and
        signed off-chain (EIP-712), enabling gasless issuance after the initial lock deposit.
      </>
    ),
  },
  {
    title: 'Why two deadlines?',
    body: (
      <>
        <code className="font-mono text-zinc-300">fillDeadline</code> bounds the solver's window.{' '}
        <code className="font-mono text-zinc-300">expires</code> bounds the user's refund. The gap
        between them gives the oracle time to attest delivery before the user can pull the rug.
      </>
    ),
  },
  {
    title: 'Multi-output orders',
    body: (
      <>
        Outputs can target multiple destination chains in a single intent. Only the first output
        runs as an auction; the rest resolve to worst price. The solver of output[0] always claims
        the inputs once every output has been delivered.
      </>
    ),
  },
  {
    title: 'EIP-7930 vs. native types',
    body: (
      <>
        The on-chain struct uses native EVM types (<code className="font-mono text-zinc-300">address</code>,{' '}
        <code className="font-mono text-zinc-300">uint256</code>). The order-server JSON wraps the
        same fields in EIP-7930 interoperable addresses so a single endpoint can serve EVM, Solana,
        Bitcoin and Sui without schema changes.
      </>
    ),
  },
]

export default function OrderAnatomy() {
  return (
    <Section
      id="anatomy"
      eyebrow="Under the hood"
      title="Anatomy of a StandardOrder"
      lede="LI.FI Intents are expressed as an OIF StandardOrder — a single struct with a single-chain input side and a multi-chain output side. Below is a real-shape example of a Base → Arbitrum USDC intent using an Exclusive Limit Order; hover any field for what it does."
    >
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <AnnotatedJson value={SAMPLE_ORDER} annotations={ANNOTATIONS} />
        </div>
        <div className="lg:col-span-2 space-y-4">
          {KEY_NOTES.map((n) => (
            <div key={n.title} className="rounded-md border border-zinc-800 bg-zinc-900/30 p-4">
              <div className="text-xs uppercase tracking-wider text-fuchsia-300/80 mb-2">
                {n.title}
              </div>
              <div className="text-sm text-zinc-300 leading-relaxed">{n.body}</div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}
