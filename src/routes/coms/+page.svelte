<script lang="ts">
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import {
        sendDataToBot,
        hapticFeedback,
        getTelegramWebApp,
    } from "$lib/telegram";
    import { addRecentCustomer } from "$lib/search";

    let customer = "";
    let side: "buy" | "sell" = "buy";
    let currency: "USDT" | "USDC" = "USDT";
    let amount = "";
    let rate = "";
    let coms: "0.005" | "0.01" = "0.005";

    let isSubmitting = false;

    onMount(() => {
        customer = $page.url.searchParams.get("customer") || "";

        // Show back button
        const webApp = getTelegramWebApp();
        if (webApp) {
            webApp.BackButton.show();
            webApp.BackButton.onClick(() => {
                goto("/");
            });
        }
    });

    function handleSubmit() {
        if (!customer || !amount || !rate) {
            hapticFeedback("error");
            return;
        }

        isSubmitting = true;
        hapticFeedback("success");
        addRecentCustomer(customer);

        const parsedAmount = parseFloat(amount.replace(/,/g, ""));
        const parsedRate = parseFloat(rate.replace(/,/g, ""));

        sendDataToBot({
            type: "coms",
            client: customer,
            side: side,
            currency: currency,
            amount: parsedAmount,
            rate: parsedRate,
            coms: parseFloat(coms),
        });
    }

    function formatNumber(value: string): string {
        const num = value.replace(/[^0-9.]/g, "");
        const parts = num.split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }

    function handleAmountInput(e: Event) {
        const input = e.target as HTMLInputElement;
        amount = formatNumber(input.value);
    }

    function handleRateInput(e: Event) {
        const input = e.target as HTMLInputElement;
        rate = input.value;
    }
</script>

<div class="container">
    <!-- Header -->
    <div class="header">
        <h1>📝 COMS</h1>
        <div class="customer-name">{customer}</div>
    </div>

    <!-- Side Selection -->
    <div class="form-group">
        <div class="form-label">Side</div>
        <div class="toggle-group">
            <button
                class="toggle-btn"
                class:active={side === "buy"}
                on:click={() => {
                    side = "buy";
                    hapticFeedback("selection");
                }}
            >
                BUY
            </button>
            <button
                class="toggle-btn"
                class:active={side === "sell"}
                on:click={() => {
                    side = "sell";
                    hapticFeedback("selection");
                }}
            >
                SELL
            </button>
        </div>
    </div>

    <!-- Currency Selection -->
    <div class="form-group">
        <div class="form-label">Currency</div>
        <div class="toggle-group">
            <button
                class="toggle-btn"
                class:active={currency === "USDT"}
                on:click={() => {
                    currency = "USDT";
                    hapticFeedback("selection");
                }}
            >
                USDT
            </button>
            <button
                class="toggle-btn"
                class:active={currency === "USDC"}
                on:click={() => {
                    currency = "USDC";
                    hapticFeedback("selection");
                }}
            >
                USDC
            </button>
        </div>
    </div>

    <!-- Amount Input -->
    <div class="form-group">
        <div class="form-label">Amount</div>
        <input
            type="text"
            inputmode="decimal"
            placeholder="เช่น 10,000"
            value={amount}
            on:input={handleAmountInput}
        />
    </div>

    <!-- Rate Input -->
    <div class="form-group">
        <div class="form-label">Rate</div>
        <input
            type="text"
            inputmode="decimal"
            placeholder="เช่น 32.450"
            value={rate}
            on:input={handleRateInput}
        />
    </div>

    <!-- Coms Selection -->
    <div class="form-group">
        <div class="form-label">Commission</div>
        <div class="toggle-group">
            <button
                class="toggle-btn"
                class:active={coms === "0.005"}
                on:click={() => {
                    coms = "0.005";
                    hapticFeedback("selection");
                }}
            >
                0.005
            </button>
            <button
                class="toggle-btn"
                class:active={coms === "0.01"}
                on:click={() => {
                    coms = "0.01";
                    hapticFeedback("selection");
                }}
            >
                0.01
            </button>
        </div>
    </div>

    <!-- Submit Button -->
    <div class="submit-section">
        <button
            class="btn btn-primary btn-full"
            on:click={handleSubmit}
            disabled={isSubmitting || !amount || !rate}
        >
            {#if isSubmitting}
                <span class="spinner"></span>
            {:else}
                Submit →
            {/if}
        </button>
    </div>
</div>

<style>
    .header {
        text-align: center;
        margin-bottom: var(--spacing-lg);
    }

    .header h1 {
        font-size: 20px;
        margin-bottom: var(--spacing-xs);
    }

    .customer-name {
        color: var(--tg-theme-button-color);
        font-weight: 600;
        font-size: 16px;
    }

    .toggle-btn.active {
        background-color: var(--tg-theme-button-color);
        border-color: var(--tg-theme-button-color);
    }

    .submit-section {
        margin-top: var(--spacing-lg);
    }

    .btn-full {
        width: 100%;
        padding: var(--spacing-md);
        font-size: 16px;
    }

    .btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
</style>
