<script>
  import Status from "@components/Status.svelte";
  import { onMount } from "svelte";
   import "nprogress/nprogress.css";
    import NProgress from "nprogress";
      import { navigating } from "$app/stores";

  onMount(async () => {
    console.log("+layout.svelte onMount")
  })

   NProgress.configure({
        // Full list: https://github.com/rstacruz/nprogress#configuration
        minimum: 0.08,
    });

    $: {
        if ($navigating) {
            NProgress.start();
        } else NProgress.done();
    }
</script>

<svelte:head>
  <title>Socialcap</title>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"
  />
</svelte:head>

<div style="position:fixed;top:0;left:0;bottom:0;right:0;">
  <slot />
</div>

<style global>
  @import "/css/custom.min.css";
  @import "/css/patches.css";
</style>
