type TNftResult = {
  page: string;
  page_size: string;
  cursor: string;
  result: {
    token_address: string;
    token_id: string;
    owner_of: string;
    token_hash: string;
    block_number: string;
    block_number_minted: string;
    contract_type: string;
    token_uri: string;
    metadata: string;
    normalized_metadata: string;
    media: string;
    minter_address: string;
    last_token_uri_sync: string;
    last_metadata_sync: string;
    amount: string;
    name: string;
    symbol: string;
    possible_spam: string;
    verified_collection: string;
    rarity_rank: number;
    rarity_label: string;
    rarity_percentage: number;
    last_sale: {
      transaction_hash: string;
      block_timestamp: string;
      buyer_address: string;
      seller_address: string;
      price: string;
      price_formatted: string;
      usd_price_at_sale: string;
      current_usd_value: string;
      token_id: string;
      payment_token: {
        token_name: string;
        token_symbol: string;
        token_logo: string;
        token_decimals: string;
        token_address: string;
      };
    };
  };
};

export type { TNftResult };
