<script lang="ts">
    import { onMount } from "svelte";
    import {
        searchCustomers,
        getRecentCustomers,
        addRecentCustomer,
    } from "$lib/search";
    import { sendRateRequest } from "$lib/api";
    import { getUserId, hapticFeedback } from "$lib/telegram";
    import { goto } from "$app/navigation";

    // shadcn-svelte components
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import * as Card from "$lib/components/ui/card";
    import { ScrollArea } from "$lib/components/ui/scroll-area";
    import { Badge } from "$lib/components/ui/badge";

    export let data;

    let searchQuery = "";
    let selectedCustomer: string | null = null;
    let recentCustomers: string[] = [];
    let filteredCustomers: string[] = [];

    $: customers = data.customers || [];
    $: hiddenCustomersSet = new Set(
        (data.hiddenCustomers || []).map((s: string) => s.toLowerCase()),
    );

    $: {
        if (searchQuery) {
            filteredCustomers = searchCustomers(searchQuery, customers);
        } else {
            filteredCustomers = customers;
        }
    }

    onMount(() => {
        // Filter recent customers to exclude hidden ones
        const allRecent = getRecentCustomers();
        recentCustomers = allRecent.filter(
            (name) => !hiddenCustomersSet.has(name.toLowerCase()),
        );
    });

    function selectCustomer(name: string) {
        selectedCustomer = name;
        hapticFeedback("selection");
    }

    async function handleAction(side: "buy" | "sell" | "both") {
        if (!selectedCustomer) return;

        try {
            hapticFeedback("medium");
            addRecentCustomer(selectedCustomer);

            // Get user ID from Telegram or use default
            const userId = getUserId() || 1437421739;

            // Send request to API
            const result = await sendRateRequest({
                client: selectedCustomer,
                side: side,
                user_id: userId,
            });

            // Show success message
            alert(`✅ ${result.message}`);
        } catch (error: any) {
            // Added : any to error for type safety
            console.error("[handleAction] Error:", error);
            alert(`❌ Error: ${error.message}`);
        }
    }

    function handleComs() {
        if (!selectedCustomer) return;

        hapticFeedback("medium");
        goto(`/coms?customer=${encodeURIComponent(selectedCustomer)}`);
    }
</script>

<div class="container mx-auto p-4 max-w-md">
    <!-- Search Bar -->
    <div class="mb-4">
        <div class="relative">
            <span
                class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >🔍</span
            >
            <Input
                type="search"
                placeholder="ค้นหาลูกค้า..."
                bind:value={searchQuery}
                class="pl-10"
            />
        </div>
    </div>

    <!-- Selected Customer Banner -->
    {#if selectedCustomer}
        <Card.Root class="mb-4 border-primary/50 bg-primary/5">
            <Card.Content class="py-3 px-4">
                <div class="flex items-center gap-2">
                    <Badge variant="secondary">👤 เลือกแล้ว</Badge>
                    <span class="font-semibold text-primary"
                        >{selectedCustomer}</span
                    >
                </div>
            </Card.Content>
        </Card.Root>

        <!-- Action Buttons -->
        <div class="grid grid-cols-2 gap-2 mb-6">
            <Button
                variant="default"
                size="lg"
                class="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold"
                onclick={() => handleAction("buy")}
            >
                BUY
            </Button>
            <Button
                variant="default"
                size="lg"
                class="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold"
                onclick={() => handleAction("sell")}
            >
                SELL
            </Button>
            <Button
                variant="default"
                size="lg"
                class="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold"
                onclick={() => handleAction("both")}
            >
                BOTH
            </Button>
            <Button
                variant="default"
                size="lg"
                class="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold"
                onclick={handleComs}
            >
                COMS
            </Button>
        </div>
    {/if}

    <!-- Recent Customers -->
    {#if recentCustomers.length > 0 && !searchQuery}
        <Card.Root class="mb-4">
            <Card.Header class="pb-2">
                <Card.Title
                    class="text-sm font-medium text-muted-foreground flex items-center gap-2"
                >
                    <span>⏱️</span>
                    <span>Recent</span>
                </Card.Title>
            </Card.Header>
            <Card.Content class="pt-0">
                <div class="space-y-1">
                    {#each recentCustomers as customer}
                        <button
                            class="w-full flex items-center justify-between p-3 rounded-lg transition-all
                                   hover:bg-accent
                                   {selectedCustomer === customer
                                ? 'bg-primary/10 border border-primary/30'
                                : 'bg-secondary/50'}"
                            onclick={() => selectCustomer(customer)}
                        >
                            <span class="text-sm">{customer}</span>
                            <span class="text-muted-foreground">›</span>
                        </button>
                    {/each}
                </div>
            </Card.Content>
        </Card.Root>
    {/if}

    <!-- Customer List -->
    <Card.Root>
        <Card.Header class="pb-2">
            <Card.Title
                class="text-sm font-medium text-muted-foreground flex items-center gap-2"
            >
                <span>📋</span>
                <span>{searchQuery ? "ผลการค้นหา" : "All Customers"}</span>
                <Badge variant="outline" class="ml-auto"
                    >{filteredCustomers.length}</Badge
                >
            </Card.Title>
        </Card.Header>
        <Card.Content class="pt-0">
            <ScrollArea class="h-[50vh]">
                {#if filteredCustomers.length === 0}
                    <div class="text-center py-8 text-muted-foreground">
                        ไม่พบลูกค้าที่ตรงกับ "{searchQuery}"
                    </div>
                {:else}
                    <div class="space-y-1 pr-4">
                        {#each filteredCustomers as customer}
                            <button
                                class="w-full flex items-center justify-between p-3 rounded-lg transition-all
                                       hover:bg-accent active:scale-[0.98]
                                       {selectedCustomer === customer
                                    ? 'bg-primary/10 border border-primary/30'
                                    : 'bg-secondary/50'}"
                                onclick={() => selectCustomer(customer)}
                            >
                                <span class="text-sm">{customer}</span>
                                <span class="text-muted-foreground">›</span>
                            </button>
                        {/each}
                    </div>
                {/if}
            </ScrollArea>
        </Card.Content>
    </Card.Root>
</div>
