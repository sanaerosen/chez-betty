/*
 * Chez Betty Javascript that attaches functions to event handlers.
 *
 */


$(".date").each(function (index) {
	d = new Date($(this).text());
	s = $.format.date(d, "MMM d, yyyy") + " at " + $.format.date(d, "h:mm a");
	$(this).text(s);
});

// Click handler to remove an item from a purchase.
$("#purchase_table tbody").on("click", ".btn-remove-item", function () {
	$(this).parent().parent().slideUp().remove();

	// Check if the cart is empty and put the "Empty Order" row back in
	if ($("#purchase_table tbody tr:visible").length == 0) {
		$("#purchase-empty").show();
	}

	// Re-calculate the total
	calculate_total();
});

// Click handler to remove an item from a purchase.
$("#purchase_table tbody").on("click", ".btn-decrement-item", function () {
	quantity = parseInt($(this).parent().find("span").text()) - 1;
	$(this).parent().find("span").text(quantity);
	if (quantity < 2) {
		$(this).hide();
	}

	item_price = parseFloat($(this).parent().parent().children(".item-price-single").text());
	$(this).parent().parent().find(".item-total").html(format_price(quantity*item_price));
	calculate_total();
});

// Click handler to submit a purchase.
$(".btn-submit-purchase").click(function () {
	$(this).blur();
	alert_clear();

	disable_button($(this));

	// Bundle all of the product ids and quantities into an object to send
	// to the server. Also include the purchasing user.
	purchase = {};
	purchase.umid = $("#user-umid").text();

	// What account to pay with?
	fields = $(this).attr("id").split("-");
	purchase["account"] = fields[2];
	if (purchase["account"] == "pool") {
		purchase["pool_id"] = fields["3"];
	}

	item_count = 0;
	$(".purchase-item").each(function (index) {
		id = $(this).attr("id");
		quantity = parseInt($(this).children(".item-quantity").text());
		pid = id.split('-')[2];
		purchase[pid] = quantity;
		item_count++;
	});

	if (item_count == 0) {
		alert_error("You must purchase at least one item.");
		enable_button($(this));
	} else {
		// Post the order to the server
		$.ajax({
			type: "POST",
			url: "/purchase/new",
			data: purchase,
			success: purchase_success,
			error: purchase_error,
			dataType: "json"
		});
	}
});

// Click handler to submit a deposit.
$(".btn-submit-deposit").click(function () {
	$(this).blur();
	alert_clear();

	disable_button($(this));

	deposit = {};
	deposit.umid = $("#user-umid").text();
	deposit.amount = strip_price($("#keypad-total").text());

	// What account to deposit to?
	fields = $(this).attr("id").split("-");
	deposit.account = fields[2];
	if (deposit.account == "pool") {
		deposit.pool_id = fields["3"];
	}

	// Post the deposit to the server
	$.ajax({
		type: "POST",
		url: "/deposit/new",
		data: deposit,
		success: deposit_success,
		error: deposit_error,
		dataType: "json"
	});
});

// Click handler to submit a deposit.
$(".btn-edit-deposit").click(function () {
	$(this).blur();
	alert_clear();

	disable_button($(this));

	deposit = {};
	deposit.umid = $("#user-umid").text();
	deposit.amount = strip_price($("#keypad-total").text());
	deposit.old_event_id = $("#event_id").text();

	// What account to deposit to?
	fields = $(this).attr("id").split("-");
	deposit.account = fields[2];
	if (deposit.account == "pool") {
		deposit.pool_id = fields["3"];
	}

	// Post the deposit to the server
	$.ajax({
		type: "POST",
		url: "/deposit/edit/submit",
		data: deposit,
		success: deposit_success,
		error: deposit_error,
		dataType: "json"
	});
});

// Button press handler for the keypad
$("#keypad").on("click", "button", function () {
	var input = full_strip_price($("#keypad-total").text());
	var value = $(this).attr("id").split("-")[2];

	if (value == "del") {
		input = input.slice(0, input.length-1);
	} else {
		input += value;
	}

	var output = parseFloat(input) / 100.0;

	$("#keypad-total").html(format_price(output));
});

$(".btn-trans-showhide").click(function () {
	var transaction_id = $(this).attr("id").split("-")[2];
	var transaction = $("#transaction-"+transaction_id)

	if (transaction.is(":visible")) {
		transaction.hide();
		$("#transaction-small-tohide-"+transaction_id).hide();
		$("#transaction-small-toshow-"+transaction_id).show();
	} else {
		transaction.show();
		$("#transaction-small-tohide-"+transaction_id).show();
		$("#transaction-small-toshow-"+transaction_id).hide();
	}
});

$(".faq-q").click(function() {
	$(this).next().toggle("fast");
});


//
// Pools
//



if (onscreen_keyboard) {
	$(".keyboard-wanted").keyboard({
	  layout : 'qwerty',
	  tabNavigation : true,
	  enterNavigation : true,
	});
}

var scrollStep = 100;

$("#scrollTop").bind("click", function(event) {
  event.preventDefault();
  $("#scrollMe").animate({
    scrollTop: "= 0px"
  });
});
$("#scrollUp").bind("click", function(event) {
  event.preventDefault();
  $("#scrollMe").animate({
    scrollTop: "-=" + scrollStep + "px"
  });
});
$("#scrollDown").bind("click", function(event) {
  event.preventDefault();
  $("#scrollMe").animate({
    scrollTop: "+=" + scrollStep + "px"
  });
});
$("#scrollBot").bind("click", function(event) {
  event.preventDefault();
  $("#scrollMe").animate({
    scrollTop: "+=" + $("#scrollMe").height() + "px"
  });
});
