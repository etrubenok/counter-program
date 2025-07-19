use anchor_lang::prelude::*;

declare_id!("2ow8n54g7gu3stq9emq4Tu7ua7YjtZQ2s4X6C5QVKFgC");

#[program]
pub mod counter_program {
    use super::*;

    pub fn initialise(ctx: Context<Initialise>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count = 0;
        msg!("Counter Account created");
        msg!("Current count: {}", counter.count);
        Ok(())
    }

    pub fn increment(ctx: Context<Update>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        let user = &ctx.accounts.user;

        msg!("User calling increment: {}", user.key);
        msg!("Previous count: {}", counter.count);
        counter.count = counter.count.checked_add(1).unwrap();
        msg!("Current count: {}", counter.count);
        Ok(())
    }

    pub fn decrement(ctx: Context<Update>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        msg!("Previous count: {}", counter.count);
        counter.count = counter.count.checked_sub(1).unwrap();
        msg!("Current count: {}", counter.count);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialise<'info> {
    #[account(init,
        payer = user,
        space = DISCRIMINATOR + Counter::INIT_SPACE)]
    pub counter: Account<'info, Counter>,

    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(mut)]
    pub counter: Account<'info, Counter>,
    pub user: Signer<'info>,
}

const DISCRIMINATOR: usize = 8;

#[account]
#[derive(InitSpace)]
pub struct Counter {
    pub count: i64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("You are not authorized to perform this action.")]
    Unauthorized,
}